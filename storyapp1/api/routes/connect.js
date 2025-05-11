import mysql from "mysql"

export const db = mysql.createConnection({
  host: process.env.MYSQLHOST,       // e.g. 'your-db-host.aivencloud.com'
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT || 3306, // adjust if needed
})
