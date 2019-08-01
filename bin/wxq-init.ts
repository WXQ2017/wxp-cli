#!/usr/bin/env node
const exists = require("fs").existsSync;
const rm = require("rimraf").sync;
const chalk = require("chalk");
const inquirer = require("inquirer");
const path = require("path");
const fetchTemplateList = require("../lib/fetch-template-list");
const utils = require("../lib/utils");
const generate = require("../lib/generate-project");
const ora = require("ora");
const download = require("download-git-repo");
import Base from "./domain/Base";
interface IWxqInit {
  run(): void;
  /**
   * 下载模板
   *
   * @param {String} tmpRepo 模板仓库
   * @param {String} tmpName  模板名称
   * @param {String} tmpUrl 模板地址
   */
  downloadAndGenerate(tmpRepo: string, tmpName: string, tmpUrl: string): void;
}
interface IOriginTemp {
  // wxq2017/config/wxq-cli.json
  description: string;
  url: string;
  name: string;
}
export default class WxqInit extends Base implements IWxqInit {
  async run() {
    try {
      const templateList = await fetchTemplateList();
      const choices = templateList.map((template: IOriginTemp) => {
        return {
          name: `${template.name} - ${template.description}`,
          value: template.name,
        };
      });
      const answer = await inquirer.prompt([
        {
          choices,
          message: "Choose template you want",
          name: "template",
          type: "list",
        },
      ]);
      // 模板名称
      const tmpName = answer.template;
      // 远程模板地址
      const tmpUrl = templateList.find(
        (template: IOriginTemp) => template.name === tmpName,
      ).url;
      const tmpDest = path.join(this.localTempRepo, tmpName);
      if (exists(tmpDest)) {
        const ans = await inquirer.prompt([
          {
            message: "The template exists.Override?",
            name: "override",
            type: "confirm",
          },
        ]);
        if (ans.override) {
          rm(tmpDest);
          this.downloadAndGenerate(this.localTempRepo, tmpName, tmpUrl);
        } else {
          generate(tmpDest);
        }
      } else {
        this.downloadAndGenerate(this.localTempRepo, tmpName, tmpUrl);
      }
    } catch (error) {
      console.log(error);
    }
  }
  downloadAndGenerate(tmpRepo: string, tmpName: string, tmpUrl: string) {
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
      .then((answer: any) => {
        spinner.start();
        console.log(chalk.red(tmpUrl, answer.branch));
        download(
          `${tmpUrl}#${answer.branch}`,
          tmpDest,
          {
            clone: false,
          },
          (err: any) => {
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
}
const wxqInit = new WxqInit();
wxqInit.run();
