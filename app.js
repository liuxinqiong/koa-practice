const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const nunjucks = require('nunjucks');
const staticFiles = require('./middlewares/static-files');
const isProduction = process.env.NODE_ENV === 'production';
const templating = require('./middlewares/templating')
const rest = require('./middlewares/rest');

const app = new Koa();

app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

app.use(rest.restify('/api/'))

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

if (!isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

app.use(bodyParser());

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// app.use(async (ctx,next)=>{
//     await next();
//     ctx.response.type = 'text/html'
//     ctx.response.body = '<h1>Hello, koa2!</h1>'
// })


app.use(controller());

module.exports = app;