const path = require("path");
module.exports = {
  helpers: {
    toLowercase: str => str.toLocaleLowerCase()
  },
  page: {
    output: path.join(process.cwd(), "src/pages"),
    templates: [
      {
        name: "demoPage-ts",
        src: path.join(__dirname, "template/demo-page"),
        // inquirer.prompt
        prompts: []
      },
      {
        name: "demoPage-js",
        src: path.join(__dirname, "pages/demo-page"),
        prompts: []
      }
    ]
  },
  component: {
    output: path.join(__dirname, "src/components"),
    templates: [
      {
        name: "ComSample",
        src: path.join(__dirname, "templates/components/ComSample"),
        prompts: [
          {
            type: "input",
            name: "content",
            message: "the content of component"
          }
        ]
      }
    ]
  }
};
