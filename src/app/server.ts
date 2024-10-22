import 'module-alias/register';
import dotenv from "dotenv"
import app from "@/app"
import logger from '@/utils/logger';

dotenv.config()

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  logger.info(`Connect at port ${PORT}`)
})