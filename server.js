const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API Key Middleware
const apiKey = 'your-secret-api-key'; // Must match frontend
const restrictAccess = (req, res, next) => {
    const providedKey = req.headers['authorization'];
    if (!providedKey || providedKey !== `Bearer ${apiKey}`) {
        return res.status(403).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
};

// Aiven MySQL Connection
try {
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

    // API Routes
    app.use('/api', restrictAccess);
    app.get('/api/personal-info', (req, res) => {
        console.log('Handling /api/personal-info');
        db.query('SELECT * FROM personal_info LIMIT 1', (err, results) => {
            if (err) {
                console.error('Query error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results[0]);
        });
    });

    app.get('/api/projects', (req, res) => {
        console.log('Handling /api/projects');
        db.query('SELECT * FROM projects', (err, results) => {
            if (err) {
                console.error('Query error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    });

    app.get('/api/skills', (req, res) => {
        console.log('Handling /api/skills');
        db.query('SELECT * FROM skills', (err, results) => {
            if (err) {
                console.error('Query error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    });

    // Root Route (for testing)
    app.get('/', (req, res) => {
        res.send('API is running');
    });

    // Catch-all
    app.get('*', (req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });
} catch (err) {
    console.error('Startup error:', err.message);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
