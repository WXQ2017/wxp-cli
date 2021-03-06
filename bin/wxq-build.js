#!/usr/bin/env node
const program = require("commander");
const path = require("path");
const exists = require("fs").existsSync;
const chalk = require("chalk");
const inquirer = require("inquirer");
const Metalsmith = require("metalsmith");
const ora = require("ora");
const Handlebars = require("handlebars");
const rm = require("rimraf").sync;
const checkVersion = require("../lib/check-version.js");
const renderTemplateFiles = require("../lib/render-template-files");
const transformIntoAbsolutePath = require("../lib/local-path")
  .transformIntoAbsolutePath;

const asunaConfig = require("../config/template.js");
const routerTplPath = require("../config/module.router.ts")
const CONSTANT = require("../config/constant")
// 指令类型
let newType;

// 是当前执行node命令时候的文件夹地址 ——工作目录
const currentDir = process.env.PWD || process.cwd();
/**
 * Usage.
 */

program
  .usage("<template-name> [project-name]")
  .option("-c, --component", "new a component")
  .option("-p --page", "new a page");

/**
 * Help.
 */

program.on("--help", () => {
  console.log(chalk.magenta("  Examples:"));
  console.log();
  console.log(
    chalk.yellow("    # create a new project with an official template")
  );
  console.log("    $ wxq build page");
  console.log();
  console.log(chalk.yellow("    # create a new component"));
  console.log("    $ wxq build component");
  console.log();
});
program.parse(process.argv);
// console.log('a',  program)
// if (program.args.length < 1) return program.help();
if (program.component || program.page || program.args.length) {
  // newType = program.args[0];
  newType = program.component ? 'component' : program.page ? 'page' : program.args[0];
} else {
  console.log();
  console.log(chalk.red(`Do not support this type <${newType}>`));
  console.log();
  program.help();
  process.exit();
}

checkVersion(() => {
  run();
});

function run() {
  // process.cwd() 是当前执行node命令时候的文件夹地址 ——工作目录
  // __dirname 是被执行的js 文件的地址 ——文件所在目录
  // console.log(chalk.green("program.config:", program.config));
  const templates = asunaConfig[`${newType}`].templates;
  const defaultDest = asunaConfig[`${newType}`].output;
  const helpers = asunaConfig.helpers;
  //注册helpers
  helpers &&
    Object.keys(helpers).map(key => {
      Handlebars.registerHelper(key, helpers[key]);
    });
  //选择模板文件
  chooseedTemplate(templates, function(choosedTemplate) {
    // console.log(`choosedTemplate:${JSON.stringify(choosedTemplate)}`);
    inquirer
      .prompt(
        [
          {
            type: "input",
            name: "name",
            message: `Input the name of new ${newType}`,
            default: choosedTemplate.name
          }
        ].concat(choosedTemplate.prompts)
      )
      .then(answers => {
        // 扩展模板数据类型
        answers = HtmlTemplateReplace(answers.name);
        // 最终构建路径
        let temName = answers.name;
        const finalDestination = path.join(
          program.dest ? transformIntoAbsolutePath(program.dest) : defaultDest,
          toLine(temName)
        );
        // console.log("最终构建路径 finalDestination", finalDestination);

        // 判断生成目录下是否存在同名
        if (exists(finalDestination)) {
          confirmOverride(newType, temName, function(override) {
            if (override) {
              rm(finalDestination);
              newPageOrComponent(
                choosedTemplate.src,
                finalDestination,
                answers
              );
            } else {
              process.exit();
            }
          });
        } else {
          newPageOrComponent(choosedTemplate.src, finalDestination, answers);
        }
      });
  });
}
/**
 * 选择模板
 * @param templates
 * @param callback
 */
function chooseedTemplate(templates, callback) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "name",
        choices: templates.map(template => template.name),
        message: `Choose one ${newType} you need`
      }
    ])
    .then(answers => {
      const { name } = answers;
      const choosedTemplate = templates.find(
        template => template.name === name
      );
      /**
       * 模板结构定义
       */
      if (typeof callback === "function") {
        callback(choosedTemplate);
      }
    });
}
/**
 *
 * @param newType
 * @param name
 * @param callback
 */
function confirmOverride(newType, name, callback) {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "override",
        message: `The ${newType} named ${name} exists!Override?`
      }
    ])
    .then(answers => {
      const { override } = answers;
      if (typeof callback === "function") {
        callback(override);
      }
    });
}

/**
 *
 * @param {String}source
 * @param {String}destination 路径
 */
function newPageOrComponent(source, destination = ".", otherMetadata = {}) {
  const spinner = ora(`Newing ${newType}...`).start();
  try {
    const metalsmith = Metalsmith(source);
    // 加入模板替换变量
    // console.log("otherMetadata:", otherMetadata)
    Object.assign(metalsmith.metadata(), otherMetadata);
    //使用中间件
    metalsmith.use(renderTemplateFiles());
    //最后生成
    metalsmith
      .source(".") // 模板文件 path
      .destination(destination) // 最终编译好的文件存放位置
      .clean(false)
      .build(function(err) {
        spinner.stop();
        if (err) throw err;
        console.log();
        console.log(chalk.green("New Successfully!"));
        console.log();
        console.log(
          `${chalk.green("Please cd")} ${chalk.cyan(destination)} ${chalk.green(
            `to check your ${newType}`
          )}`
        );
        console.log();
      });
  } catch (err) {
    spinner.stop();
    console.log(err);
  }
}

/**
 *  新增路由
 *
 */
function addRouter() {
  const basePath = path.join(currentDir, "src/");
  const fileName = "module.router.ts";
  const original = fs.readFileSync(routerTplPath).toString("utf8");
  const configContent = CONSTANT.PAGE.ANCHOR +
  process.arch +
      "  " + "内容"
      // TODO 内容
      addContentToFile(basePath, fileName, original, CONSTANT.PAGE.ANCHOR, configContent, function (err) {
      if (err) {
          console.error(err.message);
          return;
      }
  });
};
/**
 * 驼峰命名转中横线
 *
 * @param {*} name
 * @returns
 */
function toLine(name) {
  return name.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * 首字母大写
 *
 * @param {*} name 名称
 * @returns
 */
function toUpCase(name) {
  return name[0].toLocaleUpperCase() + name.substring(1);
}
/**
 * template 模板渲染替换变量对象
 *
 * @param {*} name 文件名
 * @param name 定义文件输入名 demo
 * @param className 类名 eq: Demo
 * @param lineName 驼峰转中横线命名 eq: homeList to home-list
 */
function HtmlTemplateReplace(name) {
  const config = new Object();
  if (name.indexOf("-") > -1) {
    config.name = name.split("-")[0];
  } else {
    config.name = name;
  }
  config.className = toUpCase(config.name);
  config.lineName = toLine(config.name);
  return config;
}
