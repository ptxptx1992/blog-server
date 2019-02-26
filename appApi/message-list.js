const Router=require('koa-router')
const db = require('./../database/init.js');

let router=new Router();
/**
 * @api {POST}  /message-list/message-list 获取留言列表
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
router.post('/message-list',async(ctx)=>{
    let page=ctx.request.body.page;
    let pageSize=ctx.request.body.pageSize;
    let articleId=ctx.request.body.articleId;
    let status=ctx.request.body.status;
    let startTime=ctx.request.body.startTime;
    let endTime=ctx.request.body.endTime;
    let params=[];
    let sql=`select a.id,a.content,a.date,a.status,b.title 
    from message_list as a left join article_list as b on a.article_id=b.id`;
    if(articleId){
        params.push(articleId);
        sql+='where a.id=?'
    }
    if(status){
        params.push(status);
        if(sql.indexOf('where')>-1){
            sql+=' and a.status=?'
        }else{
            sql+=' where a.status=?'
        }
        
    }
    if(startTime&&endTime){
        params.push(startTime);
        params.push(endTime);
        if(sql.indexOf('where')>-1){
            sql+=' and a.date between ? and ?'
        }else{
            sql+=' where a.date between ? and ?'
        }
    }
    sql+=' limit ?,?';
    params.push((page-1)*pageSize,pageSize);
    let info={};
    await db.query(sql,params).then((res)=>{
        let arr=[];
        res.map(val=>{
            arr.push({
                id:val.id,
                key:val.id,
                content:val.content,
                date:val.date,
                title:val.title,
                status:val.status
            })
        })
        info.list=arr;
    })
    await db.query('select count(id) as a from message_list').then((count)=>{
        info.count=count[0].a;
    })
    ctx.body={
        code:0,
        message:'success',
        data:info
    }

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
router.post('/update-status',async(ctx)=>{ 
    let status=ctx.request.body.status;
    let id=ctx.request.body.id;
    await db.query('update message_list set status=? where id=?',[status,id]).then((res)=>{
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