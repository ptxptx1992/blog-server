const Router=require('koa-router')
const bcrypt = require('bcrypt'); //引入bcrypt模块
const db = require('./../database/init.js');
let router=new Router();

router.post('/login',async(ctx)=>{
    let username=ctx.request.body.userName;
    let password=ctx.request.body.loginpassword;
    let params=[username];
    await db.query('SELECT * FROM user WHERE account = ? ',params).then((res)=>{
        if(res.length===0){
            ctx.body={
                code:500,
                message:'该用户不存在'
            }
        }else{
            if(bcrypt.compareSync(password,res[0].password)){
                ctx.body={
                    code:200,
                    message:'登录成功',
                    info:res[0]
                }
            }else{
                ctx.body={
                    code:500,
                    message:'密码错误'
                }
            }
        }
    })
});
router.post('/register',async(ctx)=>{
    let hash=bcrypt.hashSync(ctx.request.body.password,10);
    let params=[ctx.request.body.nickname,ctx.request.body.phoneNumer,hash];
    await db.query('INSERT INTO user(user_name,account,password) VALUES (?,?,?)',params).then((res)=>{
        ctx.body={
            code:200,
            message:'注册成功'
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            message:err
        }
    })
});
router.post('/visitor-login',async(ctx)=>{
    ctx.body='游客登录';
});
module.exports=router;