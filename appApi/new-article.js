const Router=require('koa-router')
const db = require('./../database/init.js');
const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const exportExcel = require('excel-export');
let router=new Router();
/**
 * @api {POST}  /new-article/add-article 保存/发布文章
 * @apiName new-article
 * @apiGroup new_article
 * @apiVersion 1.0.0
 * @apiDescription 保存/发布文章
 * @apiParam type,title,content,isPublish
 * @apiParamExample {json} 请求参数示例:
 * {"title":第一篇文章,"content":哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈,"isPublish":1}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/add-article',async(ctx)=>{
    let title=ctx.request.body.title;
    let content=ctx.request.body.content;
    let type=ctx.request.body.type;
    let isPublish=ctx.request.body.isPublish;
    let params=[title,content,type,isPublish]
    await db.query('insert into article_list (title,content,type,create_time,status) values(?,?,?,CURRENT_TIME(),?)',params).then((res)=>{
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
 * @api {POST}  /new-article/get-article 获取文章详情
 * @apiName get-article
 * @apiGroup get_article
 * @apiVersion 1.0.0
 * @apiDescription 获取文章详情
 * @apiParam type,title,content,isPublish
 * @apiParamExample {json} 请求参数示例:
 * {"title":第一篇文章,"content":哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈,"isPublish":1}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/get-article',async(ctx)=>{
    let id=ctx.request.body.id;
    let params=[id]
    await db.query('select * from article_list where id = ? group by id',params).then((res)=>{
        console.log(res)
        ctx.body={
            code:0,
            message:'success',
            data:res
        }
    }).catch(err=>{
        ctx.body={
            code:500,
            message:err,
        }
    })

});
/**
 * @api {POST}  /new-article/edit-article 编辑文章
 * @apiName get-article
 * @apiGroup get_article
 * @apiVersion 1.0.0
 * @apiDescription 获取文章详情
 * @apiParam type,title,content,isPublish
 * @apiParamExample {json} 请求参数示例:
 * {"title":第一篇文章,"content":哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈,"isPublish":1}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/edit-article',async(ctx)=>{
    let id=ctx.request.body.id;
    let title=ctx.request.body.title;
    let content=ctx.request.body.content;
    let type=ctx.request.body.type;
    let params=[title,content,type,id];
    await db.query('update article_list set title=?,content=?,type=? where id=?',params).then((res)=>{
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
 * @api {POST}  /new-article/get-article 获取文章详情
 * @apiName get-article
 * @apiGroup get_article
 * @apiVersion 1.0.0
 * @apiDescription 获取文章详情
 * @apiParam type,title,content,isPublish
 * @apiParamExample {json} 请求参数示例:
 * {"title":第一篇文章,"content":哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈,"isPublish":1}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/edit-article-status',async(ctx)=>{
    let status=ctx.request.body.status;
    let id=ctx.request.body.id;
    let params=[status,id];
    console.log('status',status)
    await db.query('update article_list set status=? where id=?',params).then((res)=>{
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
 * @api {POST}  /new-article/export-article-list 导出EXCEL
 * @apiName get-article
 * @apiGroup get_article
 * @apiVersion 1.0.0
 * @apiDescription 获取文章详情
 * @apiParam type,title,content,isPublish
 * @apiParamExample {json} 请求参数示例:
 * {"title":第一篇文章,"content":哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈,"isPublish":1}
 * @apiSuccessExample {json} 成功返回值示例
 * { "code" : 0, "message":"success" ,"data":{}}
 * @apiErrorExample {json} 失败返回值示例
 * { "code" : 500, "message":"error_message"}
 */
router.post('/export-article-list',async(ctx)=>{
    var conf={};
    conf.name='mysheet';
    conf.cols=[
        {
            caption:'id',
            type:'number',
            width:30,
        },
        {
            caption:'title',
            type:'string'
        }
    ]
    await db.query('select * from article_list group by id').then(async(res)=>{
        let arr= [];
        res.map(element => {
           arr.push([element.id,element.title])
        });
        conf.rows=arr;
        let result = exportExcel.execute(conf);
        let data = new Buffer(result,'binary');
        // ctx.set('Content-Type', 'application/vnd.openxmlformats');
        //Content-Disposition 属性是作为对下载文件的一个标识字段 inline：将文件内容直接显示在页面   attachment：弹出对话框让用户下载
        ctx.set("Content-Disposition", "attachment; filename=" +encodeURI("文章列表.xlsx"));
        ctx.body = data;
    }).catch(err=>{
        ctx.body={
            code:500,
            message:err,
        }
    })
});

// function readData (path){
// 	return new Promise(function(resolve,reject){
//         console.log('path',path)
// 		fs.readFile(path,function(err,data){
// 			if(err){
// 				reject(err);//文件存在返回true
// 			}else{
// 				resolve(data);//文件不存在，这里会抛出异常
// 			}
// 		});
// 	}).then(function(data){
// 		console.log(data);
// 		return data;
// 	},function(err){
// 		console.log(err);
// 		return err;
// 	});
// }


module.exports=router;