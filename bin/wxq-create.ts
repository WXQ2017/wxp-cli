const program = require("commander");
const chalk = require("chalk");
import Base from "./domain/Base";
import Page from "./domain/Page";
import Component from "./domain/Component";
interface IWxqBuild {}
export default class WxqBuild extends Base implements IWxqBuild {}

/**
 * Usage.
 */

program
  .usage("<templateName> [pageName]")
  .option("-c, --component", "new a component")
  .option("-p --page", "new a page");

/**
 * Help.
 */

program.on("--help", () => {
  console.log(chalk.magenta("  Examples:"));
  console.log();
  console.log(chalk.yellow("    # create a new page with name is demo-list"));
  console.log("    $ wxq create -p demoList");
  console.log();
  console.log(
    chalk.yellow("    # create a new component with name is add-info"),
  );
  console.log("    $ wxq create -c addInfo");
  console.log();
});

program.parse(process.argv);
if (program.args.length < 1) {
  program.help();
  process.exit();
}
console.log();
console.log();
let isTrue = false;
// add page
if (program.hasOwnProperty("page")) {
  const page = new Page(program.page, program.args[0]);
  page.copyFile();
  page.addPageLazyLoad();
  page.addRouter();
  isTrue = true;
}

// add component
if (program.hasOwnProperty("component")) {
  const comp = new Component(program.component, program.args[0]);
  comp.copyFile();
  comp.addCompLazyLoad();
  isTrue = true;
}

//
if (!isTrue) {
  console.log();
  console.log(chalk.red(`Do not support this type <${program.args[0]}>`));
  console.log();
  program.help();
  process.exit();
}
