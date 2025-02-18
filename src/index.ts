import express, {Express,Request,Response} from "express";
import { PORT } from "./secret";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { errorMiddleware } from "./middleware/errors";
import { signUpSchema } from "./schema/users";

const app:Express = express()

app.use(express.json())

// Use the cors middleware
app.use(cors());

app.use('/api', rootRouter)


export const prismaCilient = new PrismaClient({log : ["query"]})

app.use(errorMiddleware)

app.listen(PORT, () => {console.log("app is working")});