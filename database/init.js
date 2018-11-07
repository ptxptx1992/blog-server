const mysql = require('mysql');
const config=require('./config.js')
const pool= mysql.createPool(config);
function query(sql,params,callback){
    return new Promise((resolve,reject)=>{
        pool.getConnection(function(err,conncet){
            if(err){
                console.log(`数据库连接失败${err}`);
            }else{
                conncet.query(sql,params,function(err,result){
                    if(err){
                        console.log(`SQL error${err}`)
                        reject(err);
                    }else{
                        resolve(result);
                        conncet.release();//释放连接池中的数据库连接
                    }
                })
            }
        })
    })
    
}
exports.query = query;

