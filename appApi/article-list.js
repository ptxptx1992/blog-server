const Router=require('koa-router')
const db = require('./../database/init.js');
let router=new Router();
/**
 * @api {POST}  /article-list/article-list 获取文章列表
 * @apiName article-list
 * @apiGroup article_list
 * @apiVersion 1.0.0
 * @apiDescription 获取文章列表
 * @apiParam page,pageSize,articleType,articleStatus,startTime,endTime
 * @apiParamExample {json} 请求参数示例:
 * {"page":1,"pageSize":10}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/article-list',async(ctx)=>{
    let page=ctx.request.body.page;
    let pageSize=ctx.request.body.pageSize;
    let articleType=ctx.request.body.articleType;
    let articleStatus=ctx.request.body.articleStatus;
    let startTime=ctx.request.body.startTime;
    let endTime=ctx.request.body.endTime;
    let params=[];
    let info={
        list:[],
        count:0,
    }
    let sql='select * from article_list ';
    if(articleType){
        params.push(articleType);
        if(sql.indexOf('where')>-1){
            sql+=' and type = ?';
        }else{
            sql+=' where type = ?';
        }
    }
    if(articleStatus){
        params.push(articleStatus);
        if(sql.indexOf('where')>-1){
            sql+=' and status = ?';
        }else{
            sql+=' where status = ?';
        }
    }
    if(startTime&&endTime){
        params.push(startTime);
        params.push(endTime);
        if(sql.indexOf('where')>-1){
            sql += ' and create_time between ? and ?'
        }else{
            sql += ' where create_time between ? and ?'
        }
    }
    sql += ' group by id limit ?,? '
    params=[...params,(page-1)*pageSize,pageSize];
    
    await db.query(sql,params).then((res)=>{
        let arr=[];
        res.map(val=>{
            arr.push({
                id:val.id,
                key:val.id,
                title:val.title,
                type:val.type,
                status:val.status,
                create_time:val.create_time,
                update_time:val.update_time,
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
 * @api {POST}  /article-list/article-list-nopage 获取文章列表-不分页
 * @apiName article-list-nopage 
 * @apiGroup article-list-nopage 
 * @apiVersion 1.0.0
 * @apiDescription 获取文章列表
 * @apiParam page,pageSize,articleType,articleStatus,startTime,endTime
 * @apiParamExample {json} 请求参数示例:
 * {"page":1,"pageSize":10}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/article-list-nopage',async(ctx)=>{
    let type=ctx.request.body.type;
    let params=[]
    let sql='select * from article_list where status != 3 group by id';
    if(type){
        sql='select * from article_list where status != 3 and type = ? group by id'
        params.push(type)
    }
    let arr=[];
    await db.query(sql,params).then((res)=>{
        res.map(val=>{
            arr.push({
                id:val.id,
                key:val.id,
                title:val.title,
                content:val.content,
                time:val.create_time
            })
        });
        ctx.body={
            code:0,
            message:'success',
            data:arr
        }
    })
});

module.exports=router;