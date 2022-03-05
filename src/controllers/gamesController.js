import db from '../db.js';

export async function getGames(req, res) {
    const queryName= '';
    if(req.query.name){
        queryName = `WHERE LOWER(games.name) LIKE LOWER('%${req.query.name}%')`
    }
    try {
        const result = await db.query(`
            SELECT games.*, categories.name AS "categoryName" 
            FROM games
            JOIN categories ON games."categoryId"=categories.id
            ${queryName}
        `)
        res.status(200).send(result.rows);

    } catch (error) {
        res.status(500).send(error);    
    }
}

export async function postGame(req, res) {
    try {
        const result = await db.query(`SELECT * FROM games WHERE name=$1`, [req.body.name]);
        if(result.rows.length !== 0){
            return res.sendStatus(409);
        }
        const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

        await db.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1,$2,$3,$4,$5)
        `, [name, image, stockTotal, categoryId, pricePerDay])

    } catch (error) {
        res.status(500).send(error);    
    }
}