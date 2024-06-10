import mysql from 'mysql2';

const connectDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'uprsj'
});

connectDB.connect((err: mysql.QueryError | null) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

export default connectDB;
