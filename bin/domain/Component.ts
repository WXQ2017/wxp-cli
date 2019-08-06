import Base from "./Base";
const path = require("path");
const fs = require("fs");
const CONSTANT = require("../../config/constant");
export default class Component extends Base {
  compName: string;
  tempPath: string = path.join(
    __dirname,
    "../../",
    "config/vue-src/component/demo",
  );
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
        "src/components",
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
  addCompLazyLoad() {
    const basePath = path.join(this.currentDir, "/src/components/");
    const fileName = "fac.comp.ts";
    const content =
      CONSTANT.COMPONENT.ORIGIN +
      this.endOfLine() +
      this.replaceKeyword(this.compName, CONSTANT.COMPONENT.CONTENT);

    this.replaceFileContent(
      basePath,
      fileName,
      "",
      content,
      CONSTANT.COMPONENT.ORIGIN,
    );
  }
}
