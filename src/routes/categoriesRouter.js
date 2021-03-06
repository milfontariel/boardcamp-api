import { Router } from "express";
import { getCategories, postCategory, getTest } from '../controllers/categoriesController.js';
import validateSchema from "../middlewares/validateSchema.js";
import categorySchema from "../schemas/categorySchema.js";

const categoriesRouter = Router();

categoriesRouter.get('/', getTest);
categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', validateSchema(categorySchema), postCategory);

export default categoriesRouter;