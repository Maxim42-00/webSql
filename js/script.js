"use strict"

let db;

let goodCreate = `
    create table good(
        id integer primary key autoincrement,
        title varchar(255),
        description varchar(1024)
    );
`;

let goodInsert = `insert into good(title, description) values(?, ?)`;

try
{
    db = openDatabase('huw5', '1.0', 'Test DB', 2*1024*1024);
}
catch
{
    alert("У тебя в браузере нет WebSql. =(");
}

function initGood()
{
    db.transaction(function(tx){
        tx.executeSql(goodCreate, 
        	          [], 
        	          ()=>{console.log('good table has been created saccessfully')},
        	          ()=>{console.log('good table hasn\'t been created saccessfully')});

        tx.executeSql(goodInsert, 
        	          ['велосипед', 'полезен для здоровья'], 
        	          ()=>{console.log('data has been inserted saccessfully')},
        	          ()=>{console.log('data hasn\'t been inserted saccessfully')});
    });
}

function success(tx, result)
{
    console.log(result.rows);
}

function error(tx, error)
{
    console.log(error.message);
}

let callback = function(tx)
{
    tx.executeSql(`select 'привет' as world`, [], success, error);
    tx.executeSql(`select_ 'привет' as world`, [], success, error);
}

db.transaction(callback);