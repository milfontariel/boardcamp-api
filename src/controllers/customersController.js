import db from '../db.js';

export async function getCustomers(req, res) {
    try {
        const queryCpf = '';
        if (req.query.cpf) {
            queryCpf = `WHERE cpf LIKE '%${req.query.cpf}%'`;
            const result = await db.query(`
            SELECT * FROM customers
            ${queryName}
            `)
            res.status(200).send(result.rows);
        }
        
        if (req.params.id){
            const result = await db.query('SELECT * FROM customers WHERE id=$1', [req.params.id])
            if(result.rows.length === 0){
                return res.sendStatus(404);
            }
            res.status(200).send(result.rows);
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCustomer(req, res){
    try {
        const result = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [req.body.cpf]);
        if(result.rows.length !== 0){
            return res.sendStatus(409);
        }

        const {name, phone, cpf, birthday} = req.body;

        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1,$2,$3,$4)
        `, [name, phone, cpf, birthday]);

        res.sendStatus(201);
        
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function updateCustomer(req, res) {
    try {
        const {id} = req.params;
        const result = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [req.body.cpf]);
        if(result.rows.length !== 0){
            return res.sendStatus(409);
        }
        const {name, phone, cpf, birthday} = req.body;
        await db.query(`
            UPDATE customers 
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id = $5
        `, [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error)
    }
}