const program = require("commander");
const chalk = require("chalk");
import Base from "./domain/Base";
import Page from "./domain/Page";
import Component from "./domain/Component";
interface IWxqDelete {}
export default class WxqDelete extends Base implements IWxqDelete {}

/**
 * Usage.
 */

program
  .usage("<templateName> [pageName]")
  .option("-c, --component", "delete a component")
  .option("-p --page", "delete a page");

/**
 * Help.
 */

program.on("--help", () => {
  console.log(chalk.magenta("  Examples:"));
  console.log();
  console.log(chalk.yellow("    # delete a new page with name is demo-list"));
  console.log("    $ wxq delete -p demoList");
  console.log();
  console.log(
    chalk.yellow("    # delete a new component with name is add-info"),
  );
  console.log("    $ wxq delete -c addInfo");
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

// delete page
if (program.hasOwnProperty("page")) {
  const page = new Page(program.page, program.args[0]);
  page.delFile();
  page.delPageLazyLoad();
  page.delRouter();
  isTrue = true;
}
// delete component
if (program.hasOwnProperty("component")) {
  const comp = new Component(program.page, program.args[0]);
  comp.delFile();
  comp.delCompLazyLoad();
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
