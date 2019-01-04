const Koa=require('koa');
const Router=require('koa-router');
const user=require('./appApi/user.js');
const cors=require('koa2-cors');
const bodyParse=require('koa-bodyparser')
const session = require('koa-session');
let app=new Koa();
let router=new Router();
app.keys = ['some secret hurr']; 
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days) overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true) signed: true, //签名默认 true
    rolling:false, //在每次请求时强行设置cookie，这将重置cookie过期时间(默认:false) renew: false, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));
app.use(bodyParse());
app.use(cors({
    origin:'http://native.knowbox.cn:2018',
    credentials:true,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
// app.use(async(ctx)=>{
    

//     ctx.cookies.set('userid',1111);
//     ctx.body = 'cookie is ok';
    
// });

router.use('/user',user.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3020,()=>{
    console.log('[Server] starting at port 3020');
})