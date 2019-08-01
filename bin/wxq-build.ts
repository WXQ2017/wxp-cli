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
    chalk.yellow("    # create a new project with an official template"),
  );
  console.log("    $ wxq build page");
  console.log();
  console.log(chalk.yellow("    # create a new component"));
  console.log("    $ wxq build component");
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
if (program.hasOwnProperty("page")) {
  const page = new Page(program.page, program.args[0]);
  page.copyFile();
  // page.addFactoryFun();
  // page.addRouter();
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
