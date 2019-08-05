#!/usr/bin/env node

require("commander")
  .version(require("../package").version)
  .usage("<command> [options]")
  .command("init", "create a project of vue or react")
  .command("build", "operate")
  .command("delete", "delete operate")
  .parse(process.argv);
