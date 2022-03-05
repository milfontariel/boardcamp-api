import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.js";
import gameSchema from "../schemas/gameSchema.js";

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', validateSchema(gameSchema), postGame);

export default gamesRouter;