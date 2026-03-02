//Importing the express library which allows us to receive and handle HTTP requests to our server
import express from "express"
import userMiddleware from "./middleware/userMiddleware.js"

//Creating an instance of the an object of the express package which will be used to allows us to listen for requests
//This step allows to have access to the  express package 
const app = express()

//Local port to run the server
const PORT = process.env.PORT || 8080


app.use(express.json())

//Creating the base endpoint 
//The frontend developers can use the status code 200 as a sign that they have successful connect to the server, they can then deliver the homepage or login page to the client 
app.get("/", (req,res)=>{
    res.status(200).json({message:"Successfully connected to the server"})
})


//Start listening to incoming request from our local PORT 8080
app.listen(PORT, ()=>{
    console.log(`Server has started on PORT ${PORT}`)
})