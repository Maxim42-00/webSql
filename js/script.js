"use strict"

let db;

try
{
    db = openDatabase('huw5', '1.0', 'Test DB', 2*1024*1024);
}
catch
{
    alert("У тебя в браузере нет WebSql. =(");
}

let goodCreate = `
    create table good(
        id integer primary key autoincrement,
        title varchar(255),
        description varchar(1024)
    );
`;

let goodInsert = `insert into good(title, description) values(?, ?);`;

let customerCartCreate = `
    create table customerCart(
        prim_id integer primary key autoincrement,
        id integer,
        title varchar(255),
        description varchar(1024)
    );
`;

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

        tx.executeSql(goodInsert, 
        	          ['самокат', 'полезен для здоровья'], 
        	          ()=>{console.log('data has been inserted saccessfully')},
        	          ()=>{console.log('data hasn\'t been inserted saccessfully')});

        tx.executeSql(goodInsert, 
        	          ['мопед', 'полезен для здоровья'], 
        	          ()=>{console.log('data has been inserted saccessfully')},
        	          ()=>{console.log('data hasn\'t been inserted saccessfully')});
    });
}

function selectAllGood()
{
    db.transaction(function(tx){
        tx.executeSql("select * from good;", 
        	          [], 
        	          (tx, response)=>{renderCard(response.rows)},
        	          (tx, error)=>{console.log(error.message)});
    });
}

function addGood(id)
{
    db.transaction(function(tx){
        tx.executeSql(`
                           insert into customerCart(id, title, description)
                           select id, title, description
                           from good
                           where id = ?
        	          `, 
        	          [id], 
        	          ()=>{console.log('data has been inserted saccessfully')},
        	          ()=>{console.log('data hasn\'t been inserted saccessfully')});
    });
}

function v_cartCreate()
{
    db.transaction(function(tx){
        tx.executeSql(`
                           create view v_cart as
                               select
                               id,
                               count(*) as cnt
                           from customerCart
                           group by id;
        	          `, 
        	          [], 
        	          ()=>{console.log('view has been created saccessfully')},
        	          ()=>{console.log('view hasn\'t been created saccessfully')});
    });
}


function renderTable(list)
{
    let arr = [...list];
    let tableElem = document.createElement("table");

	arr.forEach(function(elem){
		let trElem = document.createElement("tr");
        for(let key in elem)
        {
        	let tdElem = document.createElement("td");
        	tdElem.innerText = elem[key];
        	trElem.appendChild(tdElem);
        }
        tableElem.appendChild(trElem);
	});
    console.log(list);
    document.querySelector("#root").appendChild(tableElem);
}

function renderCard(list)
{
    let arr = [...list];
    let containerElem = document.createElement("div");
    containerElem.classList.add('container');

    arr.forEach(function(elem)
    {
        let cardElem = document.createElement("div");
        cardElem.classList.add('card');
  
        for(let key in elem)
        {
            let pElem = document.createElement("p");
            pElem.innerText = elem[key];
            cardElem.appendChild(pElem);
        }
        let btnElem = document.createElement("div");
        btnElem.classList.add('btn');
        btnElem.innerText = 'Добавить';
        btnElem.addEventListener("click", ()=>addGood(elem["id"]));

        cardElem.appendChild(btnElem);
        containerElem.appendChild(cardElem);
    });
    console.log(list);
    document.querySelector("#root").appendChild(containerElem);
}


function initCustomerCart()
{
    db.transaction(function(tx){
        tx.executeSql(customerCartCreate, 
        	          [], 
        	          ()=>{console.log('customer cart table has been created saccessfully')},
        	          ()=>{console.log('customer cart table hasn\'t been created saccessfully')});

    });
}


function selectAllView()
{
    db.transaction(function(tx)
    {
        tx.executeSql(
            "select * from v_cart",
            [],
            (tx, result)=>renderBasket(result.rows),
            (tx, error)=>console.log(error.message)
        );
    });
}

function renderBasket(list)
{
    console.log(list);
    let arr = [...list];
    let basket = document.createElement("div");
    basket.classList.add("basket");
    let basketHeader = document.createElement("div");
    basketHeader.classList.add("basketHeader");
    basketHeader.innerText = "Корзина";
    basket.appendChild(basketHeader);


    arr.forEach(function(elem)
    {
        let str = document.createElement("div");
        str.innerText = "ID товара: " + elem["id"] + " Количество: "  + elem["cnt"] ;
        basket.appendChild(str);

        let delBtn = document.createElement("div");
        delBtn.classList.add('btn');
        delBtn.innerText = 'Удалить';
        delBtn.addEventListener("click", ()=>delGoodFromCustomerCart(elem["id"]));
        str.appendChild(delBtn);

    });
    document.querySelector("#root").appendChild(basket);
}

function delGoodFromCustomerCart(id)
{
    console.log("delGood");
    db.transaction(function(tx)
    {
        tx.executeSql(
            "delete from customerCart where id=?",
            [id],
            (tx, result)=>console.log("data deleted"),
            (tx, error)=>console.log("error data has not been deleted")
        );
    });
}

initGood();

initCustomerCart();

selectAllGood();

v_cartCreate();

selectAllView();
