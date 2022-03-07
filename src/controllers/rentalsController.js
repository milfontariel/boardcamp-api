import db from '../db.js';
import dayjs from 'dayjs';
import moment from 'moment';

export async function getRentals(req, res) {
    try {

        let queryCustomerId = '';
        if(req.query.customerId){
            queryCustomerId = `
                WHERE "customerId"=${req.query.customerId}
            `;
        }

        let queryGameId = '';
        if(req.query.gameId){
            queryGameId = `
                WHERE "gameId"=${req.query.gameId}
            `;
        }
        
        const result = await db.query(`
            SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName",
                games."categoryId", categories.name AS "categoryName" 
            FROM rentals 
            JOIN customers ON rentals."customerId"=customers.id 
            JOIN games ON rentals."gameId"=games.id JOIN categories ON games."categoryId"=categories.id
            ${queryCustomerId}
            ${queryGameId}
        `);
        if(result.rows.length === 0){
            return res.sendStatus(404);
        }
        const rentals = result.rows.map(row => ({

            id: row.id,
            customerId: row.customerId,
            gameId: row.gameId,
            rentDate: row.rentDate.toISOString().split('T')[0],
            daysRented: row.daysRented,
            returnDate: row.returnDate === null ? null : row.returnDate.toISOString().split('T')[0],
            originalPrice: row.originalPrice,
            delayFee: row.delayFee,
            customer: {
                id: row.customerId,
                name: row.customerName
            },
            game: {
                id: row.gameId,
                name: row.gameName,
                categoryId: row.categoryId,
                categoryName: row.categoryName
            }

        }));
        res.status(200).send(rentals);

    } catch (error) {
        res.status(500).send(error)
    }
}

export async function postRental(req, res) {

    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    let returnDate = null;
    let delayFee = null;

    try {

        if (daysRented <= 0) {
            return res.sendStatus(400); //INSERIR NO SCHEMA
        }

        const customerExist = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        if (customerExist.rows.length === 0) {
            return res.sendStatus(400);
        }

        const gameExist = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
        if (gameExist.rows.length === 0) {
            return res.sendStatus(400);
        }


        const { stockTotal } = gameExist.rows[0];
        const gameAvaible = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate"=null`, [gameId]);
        if (gameAvaible.rows.length >= stockTotal) {
            return res.sendStatus(400);
        }

        const { pricePerDay } = gameExist.rows[0];
        const originalPrice = pricePerDay * daysRented;
        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
        res.sendStatus(201);


    } catch (error) {
        res.status(500).send(error)
    }
}

export async function returnRental(req, res) {
    try {
        const id = req.params.id;
        
        const rentExist = await db.query(`SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON games.id=rentals."gameId" WHERE rentals.id=$1`, [id]);
        
        if(rentExist.rows.length <= 0){
            return res.sendStatus(404);
        }
        
        if(rentExist.rows[0].returnDate != null){
            return res.sendStatus(400);
        }

        let today = moment();
        const {rentDate, pricePerDay} = rentExist.rows[0];
        const returnDate = dayjs().format('YYYY-MM-DD');
        const delayFee = today.diff(rentDate, 'days') * pricePerDay;
        
        await db.query(`
            UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3
        `, [returnDate, delayFee, id]);
        res.sendStatus(200);
        
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function deleteRental(req, res){
    try {
        
        const {id} = req.params;
        const rentExist = await db.query(`
            SELECT * FROM rentals WHERE id=$1
        `, [id]);
        if(rentExist.rows.length === 0){
            return res.sendStatus(404);
        }
        if(rentExist.rows[0].returnDate != null){
            return res.sendStatus(400);
        }
        await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);
        res.sendStatus(200);

        
    } catch (error) {
        res.status(500).send(error)
    }
}