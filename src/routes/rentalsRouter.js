import { Router } from "express";
import { getRentals, postRental, returnRental, deleteRental } from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', postRental);
rentalsRouter.post('/rentals/:id/return', returnRental);
rentalsRouter.delete('/rentals/:id', deleteRental);

export default rentalsRouter;