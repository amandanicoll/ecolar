import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'ecolar',
  password: '1234'
});

export default db;
