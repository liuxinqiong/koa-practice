const app = require('./app');
const ws = require('./ws');

app.listen(3000);
ws(app);
console.log('app started at port 3000...');