// 避免手动维护一个sql脚本
const model = require('./model.js');
model.sync();

console.log('init db ok.');
process.exit(0);