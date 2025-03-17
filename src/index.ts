import  express, { request, Router } from "express";
import { Request, Response  } from "express";
import userRouter from "./routes/user.routes";
import taskRouter from "./routes/task.routes";


const app = express();

app.use(express.json())

// User router
app.use("/user", userRouter)
// Tasks Router
app.use("/tasks", taskRouter)


app.listen(3000, () => {
    console.log("Server is Up On : http://localhost:3000")
})


