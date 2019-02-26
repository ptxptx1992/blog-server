const Router=require('koa-router')
const db = require('./../database/init.js');

let router=new Router();
/**
 * @api {POST}  /article_type/type-list 获取文章分类列表
 * @apiName type-list
 * @apiGroup article_type
 * @apiVersion 1.0.0
 * @apiDescription 获取文章分类列表
 * @apiParam page,pageSize
 * @apiParamExample {json} 请求参数示例:
 * {"page":1,"pageSize":10}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/type-list',async(ctx)=>{
    let page=ctx.request.body.page;
    let pageSize=ctx.request.body.pageSize;
    let params=[(page-1)*pageSize,pageSize];
    let info={
        list:[],
        count:0,
    }
    await db.query('select * from article_type limit ?,?',params).then((res)=>{
        let arr=[];
        res.map(val=>{
            arr.push({
                id:val.id,
                key:val.id,
                name:val.name,
                create_time:val.create_time
            })
        })
        info.list=arr;
    })
    await db.query('select count(id) as a from article_type').then((count)=>{
        info.count=count[0].a;
    })
    ctx.body={
        code:0,
        message:'success',
        data:info
    }

});
/**
 * @api {POST}  /article_type/type-list-nopage 获取文章分类列表(不分页)
 * @apiName type-list
 * @apiGroup article_type
 * @apiVersion 1.0.0
 * @apiDescription 获取文章分类列表
 * @apiParam {}
 * @apiParamExample {json} 请求参数示例:{}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/type-list-nopage',async(ctx)=>{
    let info={
        list:[],
    }
    await db.query('select * from article_type').then((res)=>{
        let arr=[];
        res.map(val=>{
            arr.push({
                id:val.id,
                key:val.id,
                name:val.name,
            })
        })
        info.list=arr;
    })
    ctx.body={
        code:0,
        message:'success',
        data:info
    }

});
/**
 * @api {POST}  /article_type/type-add 新增文章分类
 * @apiName type-add
 * @apiGroup article_type
 * @apiVersion 1.0.0
 * @apiDescription 新增文章分类
 * @apiParam name
 * @apiParamExample {json} 请求参数示例:
 * {"name":"杂谈"}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/type-add',async(ctx)=>{ 
    let name=ctx.request.body.name;
    await db.query('insert into article_type (name,create_time) values (?,CURRENT_TIME())',[name]).then((res)=>{
        ctx.body={
            code:0,
            message:'success',
            data:{}
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            message:err,
        }
    })
});
/**
 * @api {POST}  /article_type/type-add 编辑文章分类
 * @apiName type-edit
 * @apiGroup article_type
 * @apiVersion 1.0.0
 * @apiDescription 编辑文章分类
 * @apiParam name,id
 * @apiParamExample {json} 请求参数示例:
 * {"name":"杂谈","id":6}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/type-edit',async(ctx)=>{ 
    let name=ctx.request.body.name;
    let id=ctx.request.body.id;
    await db.query('update article_type set name=?,update_time=CURRENT_TIME() where id=?',[name,id]).then((res)=>{
        ctx.body={
            code:0,
            message:'success',
            data:{}
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            message:err,
        }
    })
});
/**
 * @api {POST}  /article_type/type-delete 删除文章分类
 * @apiName type-delete
 * @apiGroup article_type
 * @apiVersion 1.0.0
 * @apiDescription 编辑文章分类
 * @apiParam name,id
 * @apiParamExample {json} 请求参数示例:
 * {"name":"杂谈","id":6}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/type-delete',async(ctx)=>{ 
    let id=ctx.request.body.id;
    await db.query('delete from article_type where id=?',[id]).then((res)=>{
        ctx.body={
            code:0,
            message:'success',
            data:{}
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            message:err,
        }
    })
});

module.exports=router;