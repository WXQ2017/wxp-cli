import Base from "./Base";
const path = require("path");
const fs = require("fs");
const CONSTANT = require("../../config/constant");
const existsSync = fs.existsSync;
const rimraf = require("rimraf");

interface IPage {
  /**
   * page模板文件路径
   */
  tempPath: string;
  /**
   * 新增page 懒加载依赖
   *
   */
  addPageLazyLoad(): void;
}
export default class Page extends Base implements IPage {
  pageName: string;
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
      files.forEach((fileName: string) => {
        const ext = this.getExtName(fileName);
        console.log(fileName);
        const pathName = path.join(this.tempPath, "pages/demo", fileName);
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
  addPageLazyLoad() {
    const basePath = path.join(this.currentDir, "/src/pages/");
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
    const basePath = path.join(this.currentDir, "/src/");
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
      "src/pages",
      this.toLine(this.pageName),
    );
    if (existsSync(filePath)) {
      rimraf(filePath, (err: any) => {
        return this.showError(err);
      });
      this.showSucceed(`delete ${this.pageName} successfully!`);
    } else {
      this.showTip(`${this.pageName} isn't exist`);
    }
  }
  delPageLazyLoad() {
    const basePath = path.join(this.currentDir, "src/pages");
    const fileName = "fac.page.ts";
    const origin = path.join(this.tempPath, "src/pages");
    const data = this.replaceKeyword(this.pageName, CONSTANT.PAGE.CONTENT);
    console.log("data:", data);
    this.replaceFileContent(
      basePath,
      fileName,
      origin,
      data,
      CONSTANT.PAGE.ORIGIN,
      true,
    );
  }
}
