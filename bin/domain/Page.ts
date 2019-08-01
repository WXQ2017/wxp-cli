import Base from "./Base";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { pathMatch } from "tough-cookie";
import { stringify } from "querystring";

interface IPage {
  /**
   * page模板文件路径
   */
  tempPath: string;
  /**
   *  写入文件
   * @param basePath 写入路径
   * @param fileName 文件名
   * @param overwrite 已存在命名
   */
  writeFile(
    basePath: string,
    fileName: string,
    data: Buffer,
    overwrite: boolean,
  ): void;
}
export default class Page extends Base implements IPage {
  pageName: string;
  constructor(bool: boolean, pageName: string) {
    super();
    this.pageName = pageName;
  }
  tempPath: string = path.resolve(__dirname, this.isVueTempPathSuffix + "page");
  copyFile() {
    fs.readdir(this.tempPath, (err, files) => {
      if (err) {
        return console.log(err);
      }
      files.forEach(fileName => {
        const ext = this.getExtName(fileName);
        const pathName = path.join(this.tempPath, fileName);
        fs.readFile(pathName, (err, data) => {
          this.replaceKeyword(fileName, data);
          const basePath = this.currentDir + "/src/page/";
          this.writeFile(basePath, fileName, data);
        });
      });
    });
  }
  async writeFile(
    basePath: string,
    fileName: string,
    data: Buffer,
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
    // fs.writeFile(fileName: ./xx.txt, data:string, options: default { 'flag': 'w' }: any, callback)
    fs.writeFile(filePath, data, { flag: "w" }, err => {
      if (err) {
        throw err;
      }
      console.log(chalk.green("created successfuly"));
    });
  }
}
