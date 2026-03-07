//importing the express package to use for receiving HTTP requests
import express from 'express'

//importing the bcrypt package to encrypt/hash sensitive information
import bcrypt from 'bcryptjs'

//importinf the jwt package to create session tokens
import jwt from 'jsonwebtoken'

//Importing the database to write queries 
import pool from '../mysql.js'


//Creating an instance of the express router which is a subset of the main app/server
const router = express.Router()

//Creating the login endpoint
router.post('/login',async (req,res)=>{

    //Desctructing the json data sent from the body of the request
    const {email,password} = req.body

    //Email testing variable 
    //Frontend developers can copy this variable to test the email entered in the frontend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    //Validating the password and email formats
    if(!password || !emailRegex.test(email)){

        //If the formats are incorrect then the request is denied
        return res.status(401).json({message:"Invalid credentials please enter the correct email and password"})

    }

    try {

        //Finding the user in the database in their email address

        const [row]= await pool.query("SELECT * FROM users WHERE email=?",[email])

            //If the resulting array's length is zero then the user does not exist in the database
            if(row.length==0){
                return res.status(401).json({message:"User does not exist"})
            }

            //Comparing the hashed password with the password the user entered to see if they match 

            //We use the compareSync method of the bcrypt package
            //If it is invalid then the password is invalid
            if(!bcrypt.compareSync(password, row[0].hashPassword)){


                /*Important to note that even when the password is invalid we do not neccessarily tell the user that the password is invalid 
                Doing so would put our database and system at risk because we could be telling a hacker that the email does exist in the database but the password is incorrect which is dangerous
                */
                return res.status(401).json({message:"Invalid credentials please enter the correct email and password"})
                
            }
            
        //Creating a session token using a combinaton of user id and our own secret key 
        const token = jwt.sign({id:row[0].id}, process.env.JWT_SECRET_KEY,  { expiresIn: '24h'})

        //Sending a session token to the frontend to be used for authentication
        return res.status(200).json({token})

    } catch (error) {   

        //If an error occurs then it is an internal server error
         res.status(500).json({message:"Internal server error, could not register user"})
        
    }

})


//Creating the register endpoint
router.post('/register',async(req,res)=>{

    //Desctructing the json data sent from the body of the request
    const {username,email,password} = req.body

    
    //Email testing variable 
    //Frontend developers can copy this variable to test the email entered in the frontend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //Testing the format of the data received if it is invalid then we send the data back
    if(!username || !password || !emailRegex.test(email)){
        return res.status(401).json({message:"Invalid input"})
    }

    try {

        //Encrypting the user password before inserting it into the database
        /*It is important to hide sensitive information before storing it into the database 
        
        This means even if the database was to be compromised the sensitive information is still protected
        */
        const hashPassword = bcrypt.hashSync(password,8)
        

        //Saving the user data into the database
        const [result]= await pool.query("INSERT INTO users (username,email,hashPassword) VALUES (?,?,?)",[username,email,hashPassword])
        
    
        //We create a session token using the userId and our secret key. This token works like a unique identifier when broswering in our software
        const token = jwt.sign({id:result.insertId}, process.env.JWT_SECRET_KEY,  { expiresIn: '24h'})

        //Sending the token to the frontend 
        return res.status(201).json({token})
        
    } catch (error) {
        
       //If an error occurs and the error code is ER_DUP_ENTRY" then the user email already exists and they cannot register for another account

       if(error.code=="ER_DUP_ENTRY"){
           return res.status(409).json({message:"User account already exists"});
       }
        return res.status(500).json({error})
    }
})



//Exporting the userAuthentication endpoint to the frontend to be used


export default router