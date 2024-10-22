import express, { type Express } from "express";
import cors from "cors"
import router from "@/routes";
import morgan from "morgan";
import logger from "@/utils/logger";

const app: Express = express()

app.use([cors(), express.json()])
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message)}}))

router(app)

export default app