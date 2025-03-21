const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const path = require('path');
const app = express();

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

// Middleware to check API key
const apiKey = 'your-secret-api-key'; // Replace with a strong, unique key
const restrictAccess = (req, res, next) => {
    const providedKey = req.headers['authorization'];
    if (!providedKey || providedKey !== `Bearer ${apiKey}`) {
        return res.status(403).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
};

// Apply to all API routes
app.use('/api', restrictAccess);

// MySQL Connection
const db = mysql.createConnection({
    host: 'mysql-36f2c12-kubota-ec6d.f.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_aVE01t5pXH6N3wsEipF',
    database: 'portfolio_db',
    port: 16372,
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// API Endpoint to Get Projects
app.get('/api/projects', (req, res) => {
    const sql = 'SELECT * FROM projects';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API Endpoint to Get Personal Info
app.get('/api/personal-info', (req, res) => {
    const sql = 'SELECT * FROM personal_info LIMIT 1';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// API Endpoint to Get Skills
app.get('/api/skills', (req, res) => {
    const sql = 'SELECT * FROM skills';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `${page}.html`), (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
