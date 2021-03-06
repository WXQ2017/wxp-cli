#!/usr/bin/env node
const path = require('path')
const exists = require('fs').existsSync
const chalk = require('chalk')
const userHome=require('user-home')
const inquirer=require('inquirer')
const download=require('download-git-repo')
const ora=require('ora')
const rm = require('rimraf').sync
const checkVersion=require('../lib/check-version.js')
const fetchTemplateList=require('../lib/fetch-template-list')
const generate=require('../lib/generate-project')

checkVersion(()=>{
  run()
})


/**
 * run
 */
function run(){
  // 本地模板存放仓库
  const tmpRepo=path.resolve(userHome,'.wxq-templates')
  // 获取模板列表
  fetchTemplateList((templateList)=>{
    const choices=templateList.map(template=>{
      return {
        name:`${template.name} - ${template.description}`,
        value:template.name
      }
    })
    inquirer.prompt([{
      type:'list',
      name:'template',
      choices,
      message:'Choose template you want'
    }]).then(answer=>{
      //模板名称
      const tmpName=answer.template
      //远程模板地址
      const tmpUrl=templateList.find(template=>template.name===tmpName).url
      const tmpDest=path.join(tmpRepo,tmpName)
      if(exists(tmpDest)){
        inquirer.prompt([
          {
            type:'confirm',
            name:'override',
            message:'The template exists.Override?'
          }
        ]).then(answer=>{
          if(answer.override) {
            rm(tmpDest)
            downloadAndGenerate(tmpRepo,tmpName,tmpUrl)
          }else{
            generate(tmpDest)
          }
        });
      }else{
        downloadAndGenerate(tmpRepo,tmpName,tmpUrl)
      }  
    })
  })
}
/**
 * 
 * @param {String} tmpRepo 
 * @param {String} tmpName 
 * @param {String} tmpUrl 
 */
function downloadAndGenerate(tmpRepo,tmpName,tmpUrl){
  const spinner=ora('downloading template...')
  const tmpDest=path.join(tmpRepo,tmpName)
  inquirer.prompt([{
    type:'input',
    name:'branch',
    message:`the name of branch you need in ${tmpName}`,
    default:'master'
  }]).then(answer=>{
    spinner.start()
    console.log(chalk.red(tmpUrl, answer.branch))
    download(`${tmpUrl}#${answer.branch}`,tmpDest,{
      clone:false
    },(err)=>{
      if(err){
        spinner.fail(chalk.red('download template unsuccessfully'))
        console.log(err)
      }else{
        spinner.succeed(chalk.green('download template successfully'))
        generate(tmpDest)
      }
    })
  })
}
