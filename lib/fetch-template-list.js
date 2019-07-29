const request=require('request')
const ora=require('ora')
const chalk=require('chalk')

module.exports=(callback)=>{
  const spinner = ora('fetching template list...')
  spinner.start()
  // github提供的读取资源文件格式如下：
  // https://raw.githubusercontent.com/:owner/:repo/master/:path
  request({
    uri:'https://raw.githubusercontent.com/WXQ2017/config/master/wxp-cli.json',
    timeout:5000
  },(err, response, body)=>{
    if(err) {
      spinner.fail(chalk.red('fetch template list unsuccessfully'))
      console.log(err)
    }
    if(response&&response.statusCode===200){
      spinner.succeed(chalk.green('fetch template list successfully'))
      callback(JSON.parse(body));
    }
  })
}
