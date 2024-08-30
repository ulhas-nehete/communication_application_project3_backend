
require('dotenv').config();
const pool = require('../db');


// getFiles API 
const getFiles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM uploads');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// allFile API
const allFile = async (req, res) => {
    const { label, filename } = req.body;
    try {
        const result = await pool.query('INSERT INTO uploads (label, filename) VALUES ($1, $2) RETURNING *', [label, filename]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// updateFile API
const updateFile = async (req, res) => {
    const { id } = req.params;
    const { label, filename } = req.body;
    try {
        const result = await pool.query('UPDATE uploads SET label = $1, filename = $2 WHERE id = $3 RETURNING *', [label, filename, id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// deleteFileById API
const deleteFileById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM uploads WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getFiles,
    allFile,
    updateFile,
    deleteFileById,
};
