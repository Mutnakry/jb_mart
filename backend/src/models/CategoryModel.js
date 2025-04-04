const mysql = require("mysql");
const db = require("../utile/db")
const {DataTypes} = mysql;

const Category = db.define('categories',{
    name:DataTypes.STRING,
    detail:DataTypes.STRING
},{
    freezeTableName:true
});

export default Category;

(async()=>{
    await db.sync();
})();