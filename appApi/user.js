const Router=require('koa-router')
const bcrypt = require('bcrypt'); //引入bcrypt模块
const db = require('./../database/init.js');
let router=new Router();
/**
 * @api {POST}  /user/login 登录后台管理页面
 * @apiName login
 * @apiGroup user
 * @apiVersion 1.0.0
 * @apiDescription  登录
 * @apiParam userName,loginpassword
 * @apiParamExample {json} 请求参数示例:
 * {"userName":13112345678,"loginpassword":1qaz2wsx}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
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
                    code:0,
                    message:'登录成功',
                    data:res[0]
                }
                }else{
                    ctx.body={
                        code:500,
                        message:'密码错误'
                    }
                }
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            message:err
        }
    })
});
/**
 * @api {POST}  /user/register 注册后台管理平台账号
 * @apiName register
 * @apiGroup user
 * @apiVersion 1.0.0
 * @apiDescription  注册
 * @apiParam nickname,phoneNumer,password
 * @apiParamExample {json} 请求参数示例:
 * {"nickname":小明,"phoneNumer":13876543210,"password":1qaz2wsx}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
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
                code:0,
                message:'注册成功',
                data:{},
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