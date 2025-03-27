const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const apiKey = process.env.API_KEY || 'secret-chheanghok-key';
const PORT = process.env.PORT || 3000;
const restrictAccess = (req, res, next) => {
    const providedKey = req.headers['authorization'];
    if (!providedKey || providedKey !== `Bearer ${apiKey}`) {
        return res.status(403).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
};

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

try {
    console.log('Starting connection to Supabase...');

    app.use('/api', restrictAccess);

    app.get('/api/personal-info', async (req, res) => {
        try {
            const { data, error } = await supabase.from('personal_info').select('*').limit(1).single();
            if (error) throw error;
            res.json(data || { error: 'No data found' });
        } catch (err) {
            console.error('Query error:', err.message);
            res.status(500).json({ error: 'Database error' });
        }
    });

    app.get('/api/projects', async (req, res) => {
        try {
            const { data, error } = await supabase.from('projects').select('*');
            if (error) throw error;
            res.json(data);
        } catch (err) {
            console.error('Query error:', err.message);
            res.status(500).json({ error: 'Database error' });
        }
    });

    app.get('/api/skills', async (req, res) => {
        try {
            const { data, error } = await supabase.from('skills').select('*');
            if (error) throw error;
            res.json(data);
        } catch (err) {
            console.error('Query error:', err.message);
            res.status(500).json({ error: 'Database error' });
        }
    });

    app.get('/', (req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });

    app.get('*', (req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });
    
    app.listen(PORT, () => {
        console.log(`Connection successful. Server running on port ${PORT}`);
    });
} catch (err) {
    console.error('Startup error:', err.message);
}
