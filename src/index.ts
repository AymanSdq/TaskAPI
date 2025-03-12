import  express, { request, Router } from "express";
import { Request, Response  } from "express";
import userRouter from "./routes/user.routes";


const app = express();

app.use(express.json())


app.use("/user", userRouter)


app.listen(3000, () => {
    console.log("Server is Up On : http://localhost:3000")
})


