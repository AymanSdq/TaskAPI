import  express, { request } from "express";
import { Request, Response  } from "express";

const app = express();

app.use(express.json())


app.get("/dossier", (req : Request , res : Response ) => {
    res.status(202).send("Hello Ayman")
})

app.post("/showme", async (req : Request , res : Response ) => {


    const { email , password} : {email : string, password : string} = await req.body

    try {

        
    } catch (error) {

    }


})


app.listen(3000, () => {
    console.log("Server is Up On : http://localhost:3000")
})


