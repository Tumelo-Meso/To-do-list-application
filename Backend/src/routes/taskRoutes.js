//importing the express package to use for receiving HTTP requests
import express from 'express'

//Importing the database to write queries 
import pool from '../mysql.js'


//Creating an instance of the express router which is a subset of the main app/server
const router = express.Router()



/*
    Create a task endpoint 
    The frontend developers are required to send the token which will be verfied with the middleware.
    They also required to send the following :
    *title,description,expectedCompletion of the task in the body 
 */
router.post('/createTask', async (req,res)=>{

    //Getting the userId from the middleware decodes id
    const userId = req.userId

    //Descturting the content of the body request
    const {title,description,expectedCompletion} = req.body

    //If the following are not present then send the request back , because we dont want to store a task with no content
    if(!title || !description || !expectedCompletion){
        return res.status(401).json({message:"Invalid input"})
    }

    //Double checking that the userId was properly decoded in the middleware

    else if (!userId){
        return res.status(401).json({message:"Unauthorized access"})
    }


    try {

        //Inserting the task into the database
        const [result] = await pool.query('INSERT INTO tasks (title,description,expectedCompletion,userId) VALUES (?,?,?,?)',[title,description,expectedCompletion,userId])

        //If successful then the message is sent back to the frontend
        return res.status(201).json({message:"Task successfully created"})

    } catch (error) {

        //If an error occurs then the message to display that we couldnt store the task is sent
        return res.status(500).json({message:"Internal Server Error"})
        
    }


})


/*
 Edit task endpoint
 This endpoint allows users to modifiy the tasks created , this means they can change the status of the task,edit title/description and even change the expectedCompletion date

 Frontend developers are expected to send the new/updated information about the task in the body of the requests, and send the userId in the header of the request
*/ 
router.put('/editTask', async (req,res)=>{

     //Getting the userId from the middleware decodes id
    const userId = req.userId


    //Descturting the content of the body request
    const {taskId,title,description,expectedCompletion,completed,versionNumber} = req.body


   //If the following are not present then send the request back , because we dont want to store a task with no content
    if(!taskId || !title || !description || !expectedCompletion  || !versionNumber){
        return res.status(401).json({message:"Invalid input"})
    }
     //Double checking that the userId was properly decoded in the middleware
    else if (!userId){
        return res.status(401).json({message:"Unauthorized access"})
    }

    /*Quick explanation on the concept of Version Number
    
        *The version number allows us to control the database modifications. This means we can protect against race conditions(when users or a user try and access the same resource at the same time),
    
        We need to ensure that a task is modified by one user one request at time.

        How this works:
            When a task is created the default version number is 1 , upon trying to edit or delete a task , the frontend(user) sends a request to edit or delete a task.
            When updating in the database we check if there exists a task with an id , usedId and version number that was sent.
            At this point the version number is 1, if the modification is successful then the version number is increase by 1 by the task id and userId havent changed.
            This means if another request from the same user , requesting the same task, the modification wont happen because the task version number will be 2
            This means upon modifying the frontend users need to refresh their pages so that the latest version of the tasks are presented so that they can be modified

            This protects against having a user logged in their mobile and web application. We cant let them make the same modification 
    */

    try {

        //Checking whether the task exists or not
        const [row] = await pool.query("SELECT * FROM tasks WHERE id =? AND userId =?",[taskId,userId])


        //If the array return is zero then the task doesnt exist 
        if(row.length === 0 ){
            return res.status(401).json({message:"Task doesnt exist"})
        }

        const [result] = await pool.query('UPDATE tasks SET title = ?, description = ?, expectedCompletion = ?, versionNumber = ?, completed =?  WHERE versionNumber = ? AND userId = ? AND id = ?',[title,description,expectedCompletion,versionNumber+1,completed,versionNumber,userId,taskId])

        //If the result affectedRows is 0 then the task has been modified by another session
        if(result.affectedRows === 0){
                return res.status(409).json({
                    message:"Task was modified by another session. Please refresh."
                })
            }

        //Else the task has been edited successfully therefore the message is sent back to the frontend
        return res.status(200).json({message:"Task edited successfully"})

    } catch (error) {

        //If an error occurs then the message to display that edit was not made is sent
        return res.status(500).json({message:"Internal Server Error"})
        
    }

})


/*
 Delete task endpoint
 This endpoint allows users to delete the tasks created 

 Frontend developers are expected to send the taskId and versionNumber  of the task the body of the requests, and send the userId in the header of the request
*/ 
router.delete('/deleteTask', async (req,res)=>{

     
     //Getting the userId from the middleware decodes id
    const userId = req.userId


    //Descturting the content of the body request
     const {taskId,versionNumber} = req.body
    
    //If the following are not present then send the request back , because we dont want to store a task with no content
    if(!taskId || !versionNumber){
        return res.status(401).json({message:"Invalid input"})
    }

     //Double checking that the userId was properly decoded in the middleware
    else if (!userId){
        return res.status(401).json({message:"Unauthorized access"})
    }

     try {

            //Checking whether the task exists or not
        const [row] = await pool.query("SELECT * FROM tasks WHERE id =? AND userId =?",[taskId,userId])

        //If the array return is zero then the task doesnt exist 
        if(row.length === 0 ){
            return res.status(401).json({message:"Task doesnt exist"})
        }
        const [result] = await pool.query("DELETE FROM tasks WHERE id=? AND versionNumber=? AND userId =?",[taskId,versionNumber,userId])

        //If the result affectedRows is 0 then the task has been modified by another session
        if(result.affectedRows === 0){
                return res.status(409).json({
                    message:"Task was modified by another session. Please refresh."
                })
            }

     //Else the task has been deleted successfully therefore the message is sent back to the frontend
        return res.status(200).json({message:"Task deleted successfully"})

    } catch (error) {
        
        //If an error occurs then the message to display the deletion could not happen is sent
        return res.status(500).json({message:"Internal Server Error"})
        
    }

})



export default router