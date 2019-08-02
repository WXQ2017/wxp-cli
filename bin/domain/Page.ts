import Base from "./Base";
const path = require("path");
const fs = require("fs");
import chalk from "chalk";
const mkdirp = require("mkdirp");
const CONSTANT = require("../../config/constant");

interface IPage {
  /**
   * page模板文件路径
   */
  tempPath: string;
  /**
   * 写入文件
   * @param basePath 写入路径
   * @param fileName 文件名
   * @param data file data
   * @param overwrite 已存在命名
   */
  writeFile(
    basePath: string,
    fileName: string,
    data: Buffer | string,
    overwrite: boolean,
  ): void;
  /**
   * 新增page 懒加载依赖
   *
   */
  addPageLazyLoad(): void;
  /**
   * 添加文件内容
   *
   * @param basePath 文件路径
   * @param {string} fileName 文件名称
   * @param {string} data 添加内容
   * @param {string} origin 添加位置锚点
   */
  addContentToFile(
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
   * @param {string} data 添加内容
   * @param {string} origin 添加位置锚点
   */
  replaceFileContent(
    basePath: string,
    fileName: string,
    data: string,
    origin: string,
  ): void;
}
export default class Page extends Base implements IPage {
  pageName: string;
  constructor(bool: boolean, pageName: string) {
    super();
    this.pageName = pageName;
  }
  tempPath: string = path.join(__dirname, this.isVueTempPathSuffix, "/page");
  copyFile() {
    fs.readdir(this.tempPath, (err: any, files: any) => {
      if (err) {
        return console.log(err);
      }
      files.forEach((fileName: string) => {
        const ext = this.getExtName(fileName);
        const pathName = path.join(this.tempPath, fileName);
        fs.readFile(pathName, (err: any, data: any) => {
          const compailedData = this.replaceKeyword(this.pageName, data);
          const basePath = path.join(
            this.currentDir,
            "/src/pages/",
            this.toLine(this.pageName),
          );
          this.writeFile(
            basePath,
            this.toLine(this.pageName) + ext,
            compailedData,
          );
        });
      });
    });
  }
  async writeFile(
    basePath: string,
    fileName: string,
    data: Buffer | string,
    overwrite?: boolean,
  ) {
    if (overwrite) {
      const override = await this.confirmOverride("page", fileName);
      // TODO
      return console.log(
        chalk.bgBlue(`${override ? "Numbered Mode!!!" : "continue..."}`),
      );
    }
    const filePath = path.join(basePath, fileName);
    // TODO  文件重复优化
    // 文件夹已存在
    if (fs.existsSync(basePath) && fs.existsSync(filePath)) {
      return;
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
  addPageLazyLoad() {
    const basePath = path.join(this.currentDir, "/src/pages/");
    const fileName = "fac.page.ts";
    const content =
      CONSTANT.PAGE.ORIGIN +
      this.endOfLine() +
      this.replaceKeyword(this.pageName, CONSTANT.PAGE.CONTENT);

    this.replaceFileContent(basePath, fileName, content, CONSTANT.PAGE.ORIGIN);
  }
  replaceFileContent(
    basePath: string,
    fileName: string,
    data: string,
    origin: string,
  ) {
    const filePath = path.join(basePath, fileName);
    if (!fs.existsSync(filePath)) {
      this.writeFile(basePath, fileName, origin);
    }
    fs.readFile(filePath, (err: any, fileData: any) => {
      let fileContent = fileData.toString("utf8");
      const regx = new RegExp(origin);
      if (fileContent.search(regx) === -1) {
        this.showTip("Failed, Don't find the origin");
      }
      fileContent = (fileContent as string).replace(regx, data);
      fs.writeFile(filePath, fileContent, (err: any) => {
        this.showError(err);
      });
    });
  }
  addContentToFile(
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
}
