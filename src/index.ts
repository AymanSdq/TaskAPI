import express from "express";
import { Request , Response } from "express-serve-static-core";

const app = express();

app.get("/", (req : Request, res : Response) => {
    res.status(202).json({Message : "Hello World"})
})

app.listen(3000, () => {
    console.log("Server is On! ")
})