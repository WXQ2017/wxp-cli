const path = require("path");
const checkVersion = require("../../lib/check-version.js");
const template = require("lodash.template");
const inquirer = require("inquirer");
const fs = require("fs");
const mkdirp = require("mkdirp");
const rm = require("rimraf").sync;

// 换行
const os = require("os");
import chalk from "chalk";
interface IBase {
  /**
   * 执行脚本所在位置
   */
  currentDir: string;
  /**
   * 本地模板存放仓库
   */
  localTempRepo: string;
  /**
   * vue文件模板文件前缀
   */
  isVueTempPathSuffix: string;
  /**
   * 检查cli版本
   */
  checkV(): void;
  /**
   * 驼峰命名转中横线
   *
   * @param {*} name
   * @returns
   */
  toLine(name: string): void;
  /**
   * 首字母大写
   *
   * @param {*} name 名称
   * @returns
   */
  toUpCase(name: string): void;
  /**
   * 提示是否覆盖操作
   * @param newType 指令类型
   * @param name 定义名称
   * @param callback
   */
  confirmOverride(newType: string, name: string): void;
  /**
   * 写入文件
   * @param basePath 写入路径
   * @param fileName 文件名
   * @param data file data
   * @param overwrite 已存在命名
   */
  writeFile(basePath: string, fileName: string, data: Buffer | string): void;
  /**
   * 添加文件内容
   * @description:
   * @param basePath 文件路径
   * @param {string} fileName 文件名称
   * @param {string} data 添加内容
   * @param {string} origin 添加位置锚点
   */
  addContentAppendToFile(
    basePath: string,
    fileName: string,
    data: string,
    origin: string,
  ): void;
  /**
   * 替换文件中指定内容
   *
   * @param {string} basePath 文件路径
   * @param {string} fileName 文件名称
   * @param {string} origin 原生模板数据
   * @param {string} data 新增内容
   * @param {string} anchor 添加位置锚点
   * @param {string} clear 清除指定内容
   */
  replaceFileContent(
    basePath: string,
    fileName: string,
    origin: string,
    data: string,
    anchor: string,
    clear?: boolean,
  ): void;
}
export default class Base implements IBase {
  localTempRepo: string = path.resolve(__dirname, "../../.wxq-vue-templates");
  currentDir: string = process.cwd();
  isVueTempPathSuffix: string = "../../config/vue-src";
  isReactTempPathSuffix: string = "../../config/react-src";
  // end-of-line marker
  endOfLine() {
    return os.EOL;
  }
  showError(err: any) {
    if (err) {
      console.log(chalk.red(err || err.message));
    }
  }
  showTip(content: string) {
    console.log(chalk.bgCyan("Tips:") + "  " + chalk.yellow(content));
  }
  showSucceed(content: string, thing?: string) {
    if (thing) {
      console.log(chalk.bgCyan(thing), "----", chalk.green(content));
    } else {
      console.log(chalk.green(content));
    }
  }
  showOperate(content: string) {
    console.log(chalk`{rgb(255,131,0) ${content}}`);
  }
  async checkV() {
    await checkVersion();
  }
  getExtName(fileName: string) {
    const i = fileName.indexOf(".");
    return i > -1 ? fileName.substr(i) : "";
  }
  toLine(name: string) {
    return name.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  toLowLine(name: string) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  toUpCase(name: string) {
    return name[0].toLocaleUpperCase() + name.substring(1);
  }

  replaceKeyword(keyword: string, content: string) {
    const compiled = template(content);
    const className = keyword;
    const lineClassName = this.toLine(keyword);
    const lowLineClassName = this.toLowLine(keyword);
    const upCaseClassName = this.toUpCase(keyword);
    return compiled({
      className,
      lineClassName,
      upCaseClassName,
      lowLineClassName,
    });
  }
  async confirmOverride(newType: string, name: string) {
    try {
      const answer: { override: boolean } = await inquirer.prompt([
        {
          type: "confirm",
          name: "override",
          message: `The ${newType} named ${name} exists!Override?`,
        },
      ]);
      return answer.override;
    } catch (error) {
      console.log(chalk.red(error));
    }
  }
  replaceFileContent(
    basePath: string,
    fileName: string,
    origin: string,
    data: string,
    anchor: string,
    clear?: boolean,
  ) {
    const filePath = path.join(basePath, fileName);
    if (!fs.existsSync(filePath)) {
      this.writeFile(basePath, fileName, origin);
    }
    fs.readFile(filePath, (err: any, fileData: any) => {
      let fileContent = fileData.toString();
      const regx = new RegExp(anchor);
      if (fileContent.search(regx) === -1) {
        this.showTip("Failed, Don't find the anchor");
      }
      if (clear) {
        // delete content
        const reg = new RegExp(data);
        fileContent = fileContent.replace(reg, "");
      } else {
        fileContent = fileContent.replace(regx, data);
      }
      fs.writeFile(filePath, fileContent, (err: any) => {
        this.showError(err);
      });
    });
  }
  addContentAppendToFile(
    basePath: string,
    fileName: string,
    data: string,
    origin: string,
  ) {
    const filePath = path.join(basePath, fileName);
    if (!fs.existsSync(filePath)) {
      this.writeFile(basePath, fileName, origin);
    }
    // 'a' - 打开文件用于追加。如果文件不存在，则创建该文件。
    fs.open(filePath, "a", (err: any, fd: any) => {
      this.showError(err);
      fs.appendFile(filePath, data, "utf8", (err: any) => {
        fs.close(fd, (err: any) => {
          this.showError(err);
        });
        this.showError(err);
      });
    });
  }
  async writeFile(basePath: string, fileName: string, data: Buffer | string) {
    const filePath = path.join(basePath, fileName);
    // TODO  文件重复优化
    // 文件夹已存在
    if (fs.existsSync(basePath) && fs.existsSync(filePath)) {
      // this.showTip(`${fileName} is existed`);
    }
    // 创建文件夹
    if (!fs.existsSync(basePath)) {
      mkdirp.sync(basePath);
    }
    // fs.writeFile(fileName: ./xx.txt, data:string, options: default { 'flag': 'w' }: any, callback)
    fs.writeFile(filePath, data, { flag: "w" }, (err: any) => {
      this.showError(err);
      this.showSucceed(`${fileName} created successfuly!`);
    });
  }
}
