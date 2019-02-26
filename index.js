const Koa=require('koa');
const Router=require('koa-router');
const user=require('./appApi/user.js');
const article_type=require('./appApi/article-type.js');
const article_list=require('./appApi/article-list.js');
const new_article=require('./appApi/new-article.js');
const message_list=require('./appApi/message-list.js');
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
router.use('/article_list',article_list.routes());
router.use('/new_article',new_article.routes());
router.use('/message_list',message_list.routes());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3020,()=>{
    console.log('[Server] starting at port 3020');
})