import joi from 'joi';

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(/^\d{10,11}$/).required(),
    cpf: joi.string().pattern(/^\d{11}$/).required(),
    birthday: joi.string().pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
})

export default customerSchema;