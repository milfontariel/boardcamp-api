import { Router } from "express";
import { getRentals, postRental, returnRental } from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', postRental);
rentalsRouter.post('/rentals/:id/return', returnRental);

export default rentalsRouter;