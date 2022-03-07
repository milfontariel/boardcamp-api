import db from '../db.js';
import sqlstring from 'sqlstring';

export async function getGames(req, res) {
    let queryName= '';
    if(req.query.name){
        queryName = sqlstring.format(`WHERE LOWER(games.name) LIKE LOWER('%${req.query.name}%')`);
    }
    try {
        const result = await db.query(`
            SELECT games.*, categories.name AS "categoryName" 
            FROM games
            JOIN categories ON games."categoryId"=categories.id
            ${sqlstring.format(queryName)}
        `)
        res.status(200).send(result.rows);

    } catch (error) {
        res.status(500).send(error);    
    }
}

export async function postGame(req, res) {
    try {
        const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
        const result = await db.query(`SELECT * FROM games WHERE name=$1`, [name]);
        if(result.rows.length !== 0){
            return res.sendStatus(409);
        }
        const searchCategory = await db.query(`SELECT * FROM categories WHERE id=$1`, [categoryId]);
        if(searchCategory.rows.length === 0){
            return res.sendStatus(400);
        }

        await db.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1,$2,$3,$4,$5)
        `, [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);    
    }
}