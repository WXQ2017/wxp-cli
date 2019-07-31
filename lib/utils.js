const fs = require("fs");
/**
 * 写入文件信息
 *
 * @export
 */
export function writeFile(fileName, data) {
  // 在同一个文件上多次使用 fs.writeFile() 且不等待回调是不安全的。 对于这种情况，建议使用 fs.createWriteStream()。
  fs.watchFile(fileName, data, "utf8", () => {});
}

/**
 * 文件追加内容
 *
 * @export
 * @param {*} fileName
 * @param {*} data
 */
export function appendFile(fileName, data) {
  fs.appendFile(fileName, data, error => {
    if (error) {
      console.log(error);
      return false;
    }
  });
}
/**
 * 重命名文件
 *
 * @export
 * @param {*} oUrl 旧文件路径
 * @param {*} nUrl 新文件路径
 */
export function reNameFile(oUrl, nUrl) {
  fs.rename(oUrl, nUrl, error => {
    if (error) {
      console.log(error);
      return false;
    }
  });
}
