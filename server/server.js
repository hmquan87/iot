const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb',
})

// app.get('/', (re, res) =>{
//     return res.json("from backend");
// });



const searchActionByDate = async (req, res) => {
    try {
        const { date, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Construct the SQL query to filter actions by date
        const sql = "SELECT * FROM clickData WHERE time(datetime) = ? LIMIT ?, ?";
        const [result] = await db.query(sql, [date, offset, parseInt(limit)]);

        // Get the total count of records for pagination
        const [count] = await db.query("SELECT COUNT(*) AS totalRecords FROM clickData WHERE time(datetime) = ?", [date]);
        const totalRecords = count[0].totalRecords;

        const totalPages = Math.ceil(totalRecords / limit);

        res.status(200).json({ totalPages, actionData: result });
    } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).send('Internal Server Error');
    }
};




app.post('/insertActionHistory', (req, res) => {
    const { device, action, time } = req.body;

    const sql = "INSERT INTO clickdata (device, action, time) VALUES (?, ?, ?)";
    const values = [device, action, time];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting action:", err);
            return res.status(500).json({ error: "Internal Server Error." });
        }
        return res.json({ message: 'Action added successfully.' });
    });
});



app.get('/actionData', (re, res) => {
    const page = parseInt(re.query.page) || 1;
    const pageSize = parseInt(re.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const sql = "SELECT * FROM clickdata LIMIT ?, ?";
    const values = [offset, pageSize];
    db.query(sql, values, (err, result) => {
        if (err) return res.json({ Message: 'error' });
        return res.json(result);
    });
});
app.get('/searchAction', (req, res) => {
    const { selectedValue, value, page, pageSize } = req.query;

    if (!selectedValue || !value) {
        return res.status(400).json({ Message: 'Type and value are required in query parameters' });
    }

    const parsedPage = parseInt(page) || 1;
    const parsedPageSize = parseInt(pageSize) || 10;
    const offset = (parsedPage - 1) * parsedPageSize;

    let sql = '';
    let errorMessage = '';
    let values = [];
    switch (selectedValue) {
        case 'all':
            sql = 'SELECT * FROM clickdata WHERE device = ? OR action = ? LIMIT ?, ?'
            errorMessage = 'All data';
            values = [value, value, value, offset, parsedPageSize];
            break;
        case 'device':
            sql = 'SELECT * FROM clickdata WHERE device = ? LIMIT ?, ?';
            errorMessage = 'Temperature is required in query parameters';
            values = [value, offset, parsedPageSize];
            break;
        case 'action':
            sql = 'SELECT * FROM clickdata WHERE action = ? LIMIT ?, ?';
            errorMessage = 'Moisture is required in query parameters';
            values = [value, offset, parsedPageSize];
            break;
        default:
            return res.status(400).json({ Message: 'Invalid type specified' });
    }

    // const values = [value, offset, parsedPageSize];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(`Error while searching ${selectedValue}:`, err);
            return res.status(500).json({ Message: 'Internal Server Error' });
        }
        return res.json(result);
    });
})


app.get('/sensorData', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const sql = `SELECT * FROM sensor LIMIT ?, ?`;
    const values = [offset, pageSize];
    db.query(sql, values, (err, result) => {
        if (err) return res.json({ Message: 'error' });
        return res.json(result);
    });
});


app.post('/insertSensor', (req, res) => {
    const { temperature, humidity, light, time } = req.body;

    const sql = "INSERT INTO sensor (temperature, moisture, light, time) VALUES (?, ?, ?, ?)";
    const values = [temperature, humidity, light, time];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting action:", err);
            return res.status(500).json({ error: "Internal Server Error." });
        }
        return res.json({ message: 'Action added successfully.' });
    });
});


app.get('/searchSensor', (req, res) => {
    const { selectedValue, value, page, pageSize } = req.query;

    if (!selectedValue || !value) {
        return res.status(400).json({ Message: 'Type and value are required in query parameters' });
    }

    const parsedPage = parseInt(page) || 1;
    const parsedPageSize = parseInt(pageSize) || 10;
    const offset = (parsedPage - 1) * parsedPageSize;

    let sql = '';
    let errorMessage = '';
    let values = [];
    switch (selectedValue) {
        case 'all':
            sql = 'SELECT * FROM sensor WHERE temperature = ? OR moisture = ? OR light = ? LIMIT ?, ?'
            errorMessage = 'All data';
            values = [value, value, value, offset, parsedPageSize];
            break;
        case 'temperature':
            sql = 'SELECT * FROM sensor WHERE temperature = ? LIMIT ?, ?';
            errorMessage = 'Temperature is required in query parameters';
            values = [value, offset, parsedPageSize];
            break;
        case 'moisture':
            sql = 'SELECT * FROM sensor WHERE moisture = ? LIMIT ?, ?';
            errorMessage = 'Moisture is required in query parameters';
            values = [value, offset, parsedPageSize];
            break;
        case 'light':
            sql = 'SELECT * FROM sensor WHERE light = ? LIMIT ?, ?';
            errorMessage = 'Light is required in query parameters';
            values = [value, offset, parsedPageSize];
            break;
        default:
            return res.status(400).json({ Message: 'Invalid type specified' });
    }

    // const values = [value, offset, parsedPageSize];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(`Error while searching ${selectedValue}:`, err);
            return res.status(500).json({ Message: 'Internal Server Error' });
        }
        return res.json(result);
    });
})

app.get('/sortSensor', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const sortOption = req.query.sortOption === 'asc' ? 'asc' : 'desc';
    const sortBy = req.query.sortBy;
    let sql = '';
    let values = [];

    switch (sortBy) {
        case 'temperature':
        case 'moisture':
        case 'light':
            sql = `SELECT * FROM sensor ORDER BY ${sortBy} ${sortOption} LIMIT ?, ?`;
            values = [offset, pageSize];
            break;
        default:
            return res.json({ Message: 'Invalid sort field' });
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.json({ Message: 'error' });
        return res.json(result);
    });
});


app.listen(port, () => {
    console.log("listening " + port);
});