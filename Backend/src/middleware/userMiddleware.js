//Import JSON WEB TOKEN for login sessions tokens
import jwt from 'jsonwebtoken'




//Middleware function

/* This function is used to check the validity of a session token send from the frontend. The token recieved is tested using one of the JWT features which can prove the if a token is valid or invalid

This function mainly protects against invalid login sessions and unauthorised changes or requests
*/
function userMiddleware(req,res,next){


    //Frontend developers are expected to send the session token in the headers of the request
    const token = req.headers['authorization']


    //If the headers don't contain a token then we send back an error message
    if(!token){
         return res.status(401).json({ message: "No session token" })
    }


    //We use the jwt.verify to verify the validity of a token
    jwt.verify(token,process.env.JWT_SECRET_KEY,(error,decoded)=>{

        //If the token verification returns an error thenn the token is invalid
        if(error){
            return res.status(401).json({ message: "Invalid token" })
        }

        //Else if the token is verified then we decode the userID associated with the session token 
        //We can use the userId to make CRUD actions which will be linked to the specific user

        req.userId = decoded.id
        next()
    })

    

}



export default userMiddleware




