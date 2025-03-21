const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

// Middleware to check API key
const apiKey = 'your-secret-api-key'; // Replace with your actual key
const restrictAccess = (req, res, next) => {
    const providedKey = req.headers['authorization'];
    if (!providedKey || providedKey !== `Bearer ${apiKey}`) {
        return res.status(403).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
};

// Aiven MySQL Connection
const uri = "mysql://avnadmin:AVNS_aVE01t5pXH6N3wsEipF@mysql-36f2c12-kubota-ec6d.f.aivencloud.com:16372/portfolio_db?ssl-mode=REQUIRED";
const url = new URL(uri.replace('mysql://', 'http://'));
const db = mysql.createConnection({
    host: url.hostname,
    port: url.port,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: {
        ca: fs.readFileSync('./ca.pem'),
        rejectUnauthorized: true
    },
    connectTimeout: 30000
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.code, err.message);
        return;
    }
    console.log('Connected to Aiven MySQL');
});

// API Routes (moved before catch-all)
app.use('/api', restrictAccess); // Apply middleware to /api routes
app.get('/api/projects', (req, res) => {
    db.query('SELECT * FROM projects', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/api/personal-info', (req, res) => {
    db.query('SELECT * FROM personal_info LIMIT 1', (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

app.get('/api/skills', (req, res) => {
    db.query('SELECT * FROM skills', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Static Routes (after API routes)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `${page}.html`), (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

// Start Server
const PORT = process.env.PORT || 3000; // Use env.PORT for Render compatibility
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
