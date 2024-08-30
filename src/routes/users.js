

const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('../db');

// getUsers API
const getUsers = (request, response) => {
    pool.query("SELECT * FROM users", function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send(results.rows);
    })
}

// getUserById API
const getUserById = (request, response) => {
    let id = +(request.params.id);

    if (isNaN(id)) {
        return response.status(200).json({ info: "use number only" });
    }

    pool.query(`SELECT * FROM users where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send(results.rows);
    })
}

// deleteUserById API
const deleteUserById = (request, response) => {
    let id = +(request.params.id);
    pool.query(`DELETE FROM users where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send(`Deleted User ID:${id}`);
    })
}


// addUser API
const addUser = async (req, res) => {
    const { fullname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sqlQuery = `INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id`;
    const values = [fullname, email, hashedPassword];

    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to add user' });
        }
        res.status(200).json({ success: true, message: 'Added User', userId: results.rows[0].id });
    });
};

// updateUser API
const updateUser = async (request, response) => {
    const id = parseInt(request.params.id);
    const { fullname, email, password } = request.body;

    if (isNaN(id)) {
        return response.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    try {
        let query = 'UPDATE users SET fullname = $1, email = $2';
        const values = [fullname, email];
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = $3';
            values.push(hashedPassword);
        }

        query += ' WHERE id = $4 RETURNING *';
        values.push(id);

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return response.status(404).json({ success: false, message: 'User not found' });
        }

        return response.status(200).json({ success: true, message: `User ID ${id} updated successfully`, user: result.rows[0] });
    } catch (error) {
        console.error('Error updating user:', error.message);
        return response.status(500).json({ success: false, message: 'Failed to update user' });
    }
};

// loginUser API
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        console.log('Email:', email);
        console.log('Password:', password);

        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];

        const result = await pool.query(query, values);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return res.status(200).json({ success: true, message: 'Login successful', user });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ success: false, message: 'Invalid email or password' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    deleteUserById,
    addUser,
    updateUser,
    loginUser,
};
