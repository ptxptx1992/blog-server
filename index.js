const Koa=require('koa');
const Router=require('koa-router');
const user=require('./appApi/user.js');
const article_type=require('./appApi/article-type.js');
const cors=require('koa2-cors');
const bodyParse=require('koa-bodyparser')
let app=new Koa();
let router=new Router();
app.use(bodyParse());
app.use(cors({
    origin:'*',
    credentials:true,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
router.use('/user',user.routes());
router.use('/article_type',article_type.routes());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3020,()=>{
    console.log('[Server] starting at port 3020');
})