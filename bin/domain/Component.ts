import Base from "./Base";
const path = require("path");
const fs = require("fs");
const rm = require("rimraf");
const CONSTANT = require("../../config/constant");
export default class Component extends Base {
  compName: string;
  tempPath: string = path.join(
    __dirname,
    "../../",
    "config/vue-src/component/demo",
  );
  moduleDir: string = "/app";
  constructor(bool: boolean, compName: string) {
    super();
    this.compName = compName;
  }
  copyFile() {
    fs.readdir(this.tempPath, (err: any, files: any) => {
      if (err) {
        return console.log(err);
      }
      const basePath = path.join(
        this.currentDir,
        "src" + this.moduleDir + "/components",
        this.toLine(this.compName),
      );
      files.forEach((fileName: string) => {
        const ext = this.getExtName(fileName);
        const pathName = path.join(this.tempPath, fileName);
        fs.readFile(pathName, (err: any, data: any) => {
          const compailedData = this.replaceKeyword(this.compName, data);
          this.writeFile(
            basePath,
            this.toLine(this.compName) + ext,
            compailedData,
          );
        });
      });
    });
  }
  delFile() {
    const filePath = path.join(
      this.currentDir,
      "src" + this.moduleDir + "/components",
      this.toLine(this.compName),
    );
    if (fs.existsSync(filePath)) {
      rm(filePath, (err: any) => {
        return this.showError(err);
      });
      this.showSucceed(
        `delete the ${this.compName} of components successfully!`,
      );
    } else {
      this.showTip(`${this.compName} isn't exist`);
    }
  }
  addCompLazyLoad() {
    const basePath = path.join(
      this.currentDir,
      "/src" + this.moduleDir + "/components/",
    );
    const fileName = "fac.comp.ts";
    const content =
      CONSTANT.COMPONENT.ORIGIN +
      this.endOfLine() +
      this.replaceKeyword(this.compName, CONSTANT.COMPONENT.CONTENT);
    const nameContent =
      CONSTANT.COMPONENT.NAME_ORIGIN +
      this.endOfLine() +
      this.replaceKeyword(this.compName, CONSTANT.COMPONENT.NAME_CONTENT);

    // this.replaceFileContent(
    //   basePath,
    //   fileName,
    //   "",
    //   content,
    //   CONSTANT.COMPONENT.ORIGIN,
    // );
    this.multiReplaceFileContent(
      basePath,
      fileName,
      "",
      [content, nameContent],
      [CONSTANT.COMPONENT.ORIGIN, CONSTANT.COMPONENT.NAME_ORIGIN],
    );
  }
  delCompLazyLoad() {
    const basePath = path.join(
      this.currentDir,
      "src" + this.moduleDir + "/components",
    );
    const fileName = "fac.comp.ts";
    const origin = path.join(this.tempPath, "src/components");
    const data = this.replaceKeyword(this.compName, CONSTANT.COMPONENT.REGX);
    this.replaceFileContent(
      basePath,
      fileName,
      origin,
      data,
      CONSTANT.COMPONENT.ORIGIN,
      true,
    );
  }
}
