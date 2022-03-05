import connection from '../db.js';

export async function getCategories(req, res) {
    try {
        const result = await connection.query('SELECT * FROM categories');
        res.status(200).send(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCategory(req, res) {
    try {
        const result = await connection.query(`SELECT * FROM categorias WHERE name=$1`, [req.body.name]);
        if(result.rows !== 0) {
            return res.sendStatus(409)
        }
        await connection.query('INSERT INTO categorias (name) VALUES ($1)', [req.body.name]);
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error);
    }
}

