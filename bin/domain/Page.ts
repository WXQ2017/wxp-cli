import Base from "./Base";
const path = require("path");
const fs = require("fs");
import chalk from "chalk";
const mkdirp = require("mkdirp");

interface IPage {
  /**
   * page模板文件路径
   */
  tempPath: string;
  /**
   * 写入文件
   *
   * @param {string} basePath 写入路径
   * @param {string} fileName 文件名
   * @param {Buffer} data file data
   * @param {boolean} overwrite 已存在命名
   * @memberof IPage
   */
  writeFile(
    basePath: string,
    fileName: string,
    data: Buffer | string,
    overwrite: boolean
  ): void;
  /**
   * 新增page 懒加载依赖
   *
   * @memberof IPage
   */
  addPageLazyLoad(): void;
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
          const compailedData = this.replaceKeyword(
            this.pageName,
            data
          );
          const basePath = path.join(
            this.currentDir,
            "/src/pages/",
            this.toLine(this.pageName)
          );
          this.writeFile(
            basePath,
            this.toLine(this.pageName) + ext,
            compailedData
          );
        });
      });
    });
  }
  async writeFile(
    basePath: string,
    fileName: string,
    data: Buffer | string,
    overwrite?: boolean
  ) {
    if (overwrite) {
      const override = await this.confirmOverride("page", fileName);
      // TODO
      return console.log(
        chalk.bgBlue(`${override ? "Numbered Mode!!!" : "continue..."}`)
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
      if (err) {
        console.log(err.message);
      }
      console.log(chalk.green("created successfuly"));
    });
  }

  addPageLazyLoad() {
    const basePath = path.join(__dirname, this.currentDir, "/src/pages/");
    const fileName = "fac.page.ts";
    // TODO page factory template
    const content = "";
    this.addContentToFile(basePath, fileName);
  }
  addContentToFile(basePath: string, fileName: string) {
    const filePath = path.join(basePath, fileName);
    if (!fs.existsSync(filePath)) {
      this.writeFile(basePath, fileName, "");
    }
    //TODO
    fs.readFile(filePath, "utf8", (err: any, data: any) => {
      
      fs.writeFile(filePath, () => {
        if (err) {

        }
      });
    });
  }
}
