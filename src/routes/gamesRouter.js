import { Router } from "express";
import validateGame from "../middlewares/gameSchemaValidate.js";
import gameSchema from "../schemas/gameSchema.js";

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', validateGame(gameSchema), postGame);

export default gamesRouter;