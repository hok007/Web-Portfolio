const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const apiKey = 'your-secret-api-key';
const restrictAccess = (req, res, next) => {
    const providedKey = req.headers['authorization'];
    if (!providedKey || providedKey !== `Bearer ${apiKey}`) {
        return res.status(403).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
};

const supabaseUrl = 'https://plebqhbnlzuvzphkiwzv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZWJxaGJubHp1dnpwaGtpd3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzE4MzgsImV4cCI6MjA1ODU0NzgzOH0.MsOy2cTqPSCAMBAcm0qrkcngPeHW-PmTQE_gsIcpPpY';
const supabase = createClient(supabaseUrl, supabaseKey);

try {
    console.log('Starting connection to Supabase...');

    // Test Supabase connection (optional)
    supabase.from('personal_info').select('*').limit(1)
        .then(() => console.log('Connected to Supabase'))
        .catch(err => console.error('Supabase connection failed:', err.message));

    app.use('/api', restrictAccess);

    // GET /api/personal-info
    app.get('/api/personal-info', async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('personal_info')
                .select('*')
                .limit(1)
                .single();
            if (error) throw error;
            res.json(data || { error: 'No data found' });
        } catch (err) {
            console.error('Query error:', err.message);
            res.status(500).json({ error: 'Database error' });
        }
    });

    // GET /api/projects
    app.get('/api/projects', async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*');
            if (error) throw error;
            res.json(data);
        } catch (err) {
            console.error('Query error:', err.message);
            res.status(500).json({ error: 'Database error' });
        }
    });

    // GET /api/skills
    app.get('/api/skills', async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*');
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
} catch (err) {
    console.error('Startup error:', err.message);
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
