const path = require("path");
const checkVersion = require("../../lib/check-version.js");
const template = require("lodash.template");
const inquirer = require("inquirer");
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
}
export default class Base implements IBase {
  localTempRepo: string = path.resolve(__dirname, "../.wxq-vue-templates");
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

  toUpCase(name: string) {
    return name[0].toLocaleUpperCase() + name.substring(1);
  }

  replaceKeyword(keyword: string, content: string) {
    const compiled = template(content);
    const className = keyword;
    const lineClassName = this.toLine(keyword);
    const upCaseClassName = this.toUpCase(keyword);
    return compiled({ className, lineClassName, upCaseClassName });
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
}
