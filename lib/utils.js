const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");
/**
 * 写入文件信息
 *
 * @export
 */
function writeFile(fileName, data) {
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
function appendFile(fileName, data) {
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
function reNameFile(oUrl, nUrl) {
  fs.rename(oUrl, nUrl, error => {
    if (error) {
      console.log(error);
      return false;
    }
  });
}

/**
 *
 *
 * @export
 * @param {*} basePath
 * @param {*} fileName
 * @param {*} original
 * @param {*} anchor
 * @param {*} content
 * @param {*} callback
 */
function addContentToFile(
  basePath,
  fileName,
  original,
  anchor,
  content,
  callback,
) {
  var filePath = path.join(basePath, fileName);
  if (!fs.existsSync(filePath)) {
    this.writeFile(basePath, fileName, original);
  }
  // 读文件写文件
  fs.readFile(filePath, function(err, data) {
    if (err) {
      callback(err);
      return;
    }
    var fileContent = data.toString();
    var reg = new RegExp(anchor);
    if (fileContent.search(reg) === -1) {
      winston.error("Failed! Anchor not find.");
      return;
    }
    fileContent = fileContent.replace(reg, content);
    fs.writeFile(filePath, fileContent, function(error) {
      if (error) {
        callback(error);
        return;
      }
      callback(undefined);
    });
  });
}

/**
 * 下载模板
 *
 * @param {String} tmpRepo 模板仓库
 * @param {String} tmpName  模板名称
 * @param {String} tmpUrl 模板地址
 */
function downloadAndGenerate(tmpRepo, tmpName, tmpUrl) {
  const spinner = ora("downloading template...");
  const tmpDest = path.join(tmpRepo, tmpName);
  inquirer
    .prompt([
      {
        type: "input",
        name: "branch",
        message: `the name of branch you need in ${tmpName}`,
        default: "master",
      },
    ])
    .then(answer => {
      spinner.start();
      console.log(chalk.red(tmpUrl, answer.branch));
      download(
        `${tmpUrl}#${answer.branch}`,
        tmpDest,
        {
          clone: false,
        },
        err => {
          if (err) {
            spinner.fail(chalk.red("download template unsuccessfully"));
            console.log(err);
          } else {
            spinner.succeed(chalk.green("download template successfully"));
            generate(tmpDest);
          }
        },
      );
    });
}

module.exports = {
  writeFile,
  appendFile,
  reNameFile,
  addContentToFile,
  downloadAndGenerate,
};
