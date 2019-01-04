const Router=require('koa-router')
const bcrypt = require('bcrypt'); //引入bcrypt模块
const db = require('./../database/init.js');
const session = require('koa-session');
let router=new Router();
router.get('/cookie',async(ctx)=>{
    // ctx.cookies.set(
    //     'MyName','JSPang',{
    //          // 写cookie所在的域名
           
    //         maxAge:1000*60*60*24,   // cookie有效时长
    //         expires:new Date('2018-12-31'), // cookie失效时间
    //         httpOnly:false,  // 是否只用于http请求中获取
    //         overwrite:false  // 是否允许重写
    //     }
    // );

    ctx.session.username = "张三";
    ctx.body={
        code:200,
        message:'成功'
    }
})
router.post('/login',async(ctx)=>{
    ctx.cookies.set('userid',1111,{
        domain:'.knowbox.cn:2018',
        path:'/',
        maxAge:1000*60*60*24,   // cookie有效时长
        expires:new Date('2019-12-31'), // cookie失效时间
        httpOnly:false,
    });
    ctx.body={
        code:200,
        message:'get it'
    }
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
                
                
                console.log(ctx.cookies.set)
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
    let result=await db.query('select * from user where account = ?',[ctx.request.body.phoneNumer]);
    if(result.length){
        ctx.body={
            code:500,
            message:'该用户已经被注册'
        }
    }else{
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
    }
});

module.exports=router;