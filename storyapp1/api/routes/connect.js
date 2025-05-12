import mysql from "mysql"

export const db = mysql.createConnection({
  //connectionLimit: 10,
  host: process.env.MYSQLHOST,       
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT || 3306, // adjust if needed
})

db.getConnection((err, connection) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("DB connected");
    connection.release(); // release back to pool
  }
});
