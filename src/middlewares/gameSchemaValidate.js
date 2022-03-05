export default async function validateGame(schema){
    return (req, res, next) => {
        const validation = schema.validate(req.body);
        if(validation.error){
            return res.sendStatus(400);
        }
        next();
    }
}