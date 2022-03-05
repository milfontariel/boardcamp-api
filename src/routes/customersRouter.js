import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.js";
import customerSchema from "../schemas/customerSchema.js";

import { getCustomers, postCustomer, updateCustomer } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomers);
customersRouter.post('/customers', validateSchema(customerSchema), postCustomer);
customersRouter.put('/customers', validateSchema(customerSchema), updateCustomer);


export default customersRouter;