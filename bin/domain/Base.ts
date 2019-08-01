const path = require("path");
const checkVersion = require("../../lib/check-version.js");
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
   * 检查cli版本
   */
  checkV(): void;
}
export default class Base implements IBase {
  localTempRepo: string = path.resolve(__dirname, "../.wxq-vue-templates");
  currentDir: string = process.cwd();
  async checkV() {
    await checkVersion();
  }
}
