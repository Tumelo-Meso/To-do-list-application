//Importing the express library which allows us to receive and handle HTTP requests to our server
import express from "express"

//Importing account routes from accountRoutes.js filr
import accountRoutes from './routes/accountRoutes.js'


//Importing usermiddleware
import userMiddleware from "./middleware/userMiddleware.js"


//Importing the database to write data into 
import pool from "./mysql.js"


//Creating an instance of the an object of the express package which will be used to allows us to listen for requests
//This step allows to have access to the  express package 
const app = express()

//Local port to run the server
const PORT = process.env.PORT || 8080

//Using an express feature that allows us to read json content sent to us
app.use(express.json())

//Creating the base endpoint 
//The frontend developers can use the status code 200 as a sign that they have successful connect to the server, they can then deliver the homepage or login page to the client 
app.get("/", (req,res)=>{
    res.status(200).json({message:"Successfully connected to the server"})
})


//Creating the base userAuthentication endpoint
//Frontend developers can use the status 200 to redirect from the home page to the sign in /sign up page
//In the case of mobile development this can be the first displaying page
app.get('/userAuthentication',(req,res)=>{
    res.status(200).json({message:"Successfully connected to the authentication page"})

})


//Creating the base tasks endpoint
//Frontend developers can use the status 200 to redirect from the login/sign up page to the main pages of the application where they can do all CRUD operations

/*This page is protected by a middleware which ensures that a user only receives a this page if they are probably authenticated 
    Nagivate to middleware/userMiddleware.js to read more about middleware function
*/
app.get('/tasks',userMiddleware,async (req,res)=>{

    //We can use the userId decoded from the session token to retrieve the user data from the database
    const userId = req.userId


    //If the userId is not present then the request is invalid
    if(!userId){
        return res.status(403).json({message:"Unauthorized access"})
    }
    
    try {


        //Select all the user data from the database where the id matches the userId
        const [row] = await  pool.query('SELECT * FROM users WHERE id = ?', [userId])

        
        //If the resulting array is empty then no user with that id was found in our database
        if(row[0].length==0){
            return res.status(403).json({message:"User does not exist"})
        }


        //Getting all the tasks related to the specific user
        const [row2] = await pool.query('SELECT * FROM tasks WHERE userId = ?', [userId])

        //Combining the tasks and user info into one object before sending to the front end 
        const userInfo = {
            id : row[0].id,
            username : row[0].username,
            email : row[0].email,
            tasks : row2
        }

        //Sending the user data to the frontend 
        return res.status(200).json(userInfo)

        
    } catch (error) {
        //If an error occurs during the retrieval of data 
        res.status(500).json({message:"Internal server error, could not register user"})
    }

})



//Using all endpoints of userAuthentication 
app.use('/userAuthentication',accountRoutes)

//Using all endpoints of tasks which will all be protect by the userMiddleware
app.use('/tasks',userMiddleware)


//Start listening to incoming request from our local PORT 8080
app.listen(PORT, ()=>{
    console.log(`Server has started on PORT ${PORT}`)
})