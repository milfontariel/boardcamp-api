import { Router } from "express";

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.post('/customers', postCustomers);

export default customersRouter;