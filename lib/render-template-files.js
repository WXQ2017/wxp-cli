const async = require("async");
const Handlebars = require("handlebars");
const render = require("consolidate").handlebars.render;

// 首字母小写
Handlebars.registerHelper("firstLettertoLowercase", function(name) {
  return name[0].toLocaleLowerCase() + name.substring(1);
});
// 首字母大写
Handlebars.registerHelper("firstLettertoUpperCase", function(name) {
  return name[0].toLocaleUpperCase() + name.substring(1);
});
/**
 * 渲染模板文件
 */
function renderTemplateFiles() {
  return (files, metalsmith, done) => {
    const keys = Object.keys(files);
    const metalsmithMetadata = metalsmith.metadata();
    // 遍历替换模板
    async.each(
      keys,
      (fileName, next) => {
        // 读取文件内容
        const str = files[fileName].contents.toString();
        // 不渲染不含mustaches表达式的文件
        if (!/{{([^{}]+)}}/g.test(str)) {
          return next();
        }
        // 调用 handlebars 渲染文件
        render(str, metalsmithMetadata, (err, res) => {
          if (err) {
            err.message = `[${fileName}] ${err.message}`;
            return next(err);
          }

          // replace demo.vue to xx.vue
          const lineName = metalsmith.metadata().lineName
          const ext = fileName.split('.')[1]
          const suffix = fileName.split('.')[0]
          files[fileName].contents = new Buffer(res);
          files[lineName + "." + ext] = files[fileName]
          delete files[fileName]

          next();
        });
      },
      done
    );
  };
}

module.exports = renderTemplateFiles;
