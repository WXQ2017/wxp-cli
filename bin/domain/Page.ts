import Base from "./Base";
const path = require("path");
const fs = require("fs");
const CONSTANT = require("../../config/constant");
const existsSync = fs.existsSync;
const rm = require("rimraf");

interface IPage {
  /**
   * page模板文件路径
   */
  tempPath: string;
  /**
   * 应用文件夹名
   *
   * @type {string}
   * @memberof IPage
   */
  moduleDir: string;
  /**
   * 新增page 懒加载依赖
   *
   */
  addPageLazyLoad(): void;
  /**
   * 读取文件列表渲染写入
   *
   * @param {any[]} files 文件列表
   * @param {string} basePath 文件目录地址
   * @memberof IPage
   */
  multiFileWrite(files: any[], basePath: string): void;
}
export default class Page extends Base implements IPage {
  pageName: string;
  moduleDir: string = "/app";
  constructor(bool: boolean, pageName: string) {
    super();
    this.pageName = pageName;
  }
  tempPath: string = path.join(
    __dirname,
    this.isVueTempPathSuffix,
    "page/demo",
  );
  copyFile() {
    fs.readdir(this.tempPath, (err: any, files: any) => {
      if (err) {
        return console.log(err);
      }
      const basePath = path.join(
        this.currentDir,
        "src" + this.moduleDir + "/pages",
        this.toLine(this.pageName),
      );
      console.log("basePath", basePath);
      if (existsSync(basePath)) {
        this.confirmOverride("page", this.pageName).then(bool => {
          if (bool) {
            // rm(basePath, (err: any) => {
            //   return this.showError(err);
            // });
            // this.multiFileWrite(files, basePath);
            this.showError("coding is important, so avoid to modify");
          }
        });
      } else {
        this.multiFileWrite(files, basePath);
      }
    });
  }
  multiFileWrite(files: any[], basePath: string) {
    files.forEach((fileName: string) => {
      const ext = this.getExtName(fileName);
      const pathName = path.join(this.tempPath, fileName);
      fs.readFile(pathName, (err: any, data: any) => {
        const compailedData = this.replaceKeyword(this.pageName, data);
        this.writeFile(
          basePath,
          this.toLine(this.pageName) + ext,
          compailedData,
        );
      });
    });
  }
  addPageLazyLoad() {
    const basePath = path.join(
      this.currentDir,
      "/src" + this.moduleDir + "/pages",
    );
    const fileName = "fac.page.ts";
    const content =
      CONSTANT.PAGE.ORIGIN +
      this.endOfLine() +
      this.replaceKeyword(this.pageName, CONSTANT.PAGE.CONTENT);

    this.replaceFileContent(
      basePath,
      fileName,
      "",
      content,
      CONSTANT.PAGE.ORIGIN,
    );
  }
  addRouter() {
    const basePath = path.join(this.currentDir, "/src/" + this.moduleDir);
    const fileName = "module.router.ts";
    const tempPath = path.join(
      __dirname,
      this.isVueTempPathSuffix,
      "/",
      fileName,
    );
    const origin = fs.readFileSync(tempPath);
    const data =
      CONSTANT.PAGE.ROUTER_ORIGIN +
      "\n" +
      this.replaceKeyword(this.pageName, CONSTANT.PAGE.ROUTER_CONTENT);
    const anchor = CONSTANT.PAGE.ROUTER_ORIGIN;
    this.replaceFileContent(basePath, fileName, origin, data, anchor);
  }
  delFile() {
    const filePath = path.join(
      this.currentDir,
      "src" + this.moduleDir + "/pages",
      this.toLine(this.pageName),
    );
    if (existsSync(filePath)) {
      rm(filePath, (err: any) => {
        return this.showError(err);
      });
      this.showSucceed(`delete ${this.pageName} successfully!`);
    } else {
      this.showTip(`${this.pageName} isn't exist`);
    }
  }
  delPageLazyLoad() {
    const basePath = path.join(
      this.currentDir,
      "src" + this.moduleDir + "/pages",
    );
    const fileName = "fac.page.ts";
    const origin = path.join(this.tempPath, "src/pages");
    const data = this.replaceKeyword(this.pageName, CONSTANT.PAGE.REGX);
    this.replaceFileContent(
      basePath,
      fileName,
      origin,
      data,
      CONSTANT.PAGE.ORIGIN,
      true,
    );
  }
  delRouter() {
    const basePath = path.join(this.currentDir, "/src" + this.moduleDir);
    const fileName = "module.router.ts";
    const tempPath = path.join(
      __dirname,
      this.isVueTempPathSuffix,
      "/",
      fileName,
    );
    const origin = fs.readFileSync(tempPath);
    const data = this.replaceKeyword(
      this.pageName,
      CONSTANT.PAGE.ROUTER_CONTENT,
    );
    const anchor = CONSTANT.PAGE.ROUTER_ORIGIN;
    const isClear = true;
    this.replaceFileContent(basePath, fileName, origin, data, anchor, isClear);
  }
}
