import db from '../db.js';

export async function getCustomers(req, res) {
    try {
        let queryCpf = '';
        if (req.query.cpf) {
            queryCpf = `WHERE cpf LIKE '%${req.query.cpf}%'`;
            const result = await db.query(`SELECT * FROM customers ${queryCpf}`);
            return res.status(200).send(result.rows);
        }
        
        if (req.params.id){
            const result = await db.query('SELECT * FROM customers WHERE id=$1', [req.params.id])
            if(result.rows.length === 0){
                return res.sendStatus(404);
            }
            return res.status(200).send(result.rows[0]);
        }

        const result = await db.query(`
            SELECT * FROM customers
        `)
        res.status(200).send(result.rows);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postCustomer(req, res){
    try {
        const {name, phone, cpf, birthday} = req.body;
        const result = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if(result.rows.length !== 0){
            return res.sendStatus(409);
        }

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
        const {name, phone, cpf, birthday} = req.body;
        const result = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if(result.rows.length !== 0){
            return res.sendStatus(409);
        }
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