import mysql from "mysql"

export const db = mysql.createConnection({
  host: process.env.DB_HOST,       // e.g. 'your-db-host.aivencloud.com'
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // adjust if needed
})
