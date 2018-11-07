const Koa=require('koa');
const Router=require('koa-router');
const db = require('./database/init.js');
const user=require('./appApi/user.js');
const cors=require('koa2-cors');
const bodyParse=require('koa-bodyparser')
let app=new Koa();
let router=new Router();
app.use(bodyParse());
app.use(cors());
router.use('/user',user.routes());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000,()=>{
    console.log('[Server] starting at port 3000');
})