const express = require("express");
const router = express.Router();

const {login , signup} = require("../Controllers/Auth");
const {auth , isStudent , isAdmin } = require("../middlewares/auth");

router.post("/login" , login);
router.post("/signup" , signup);

// router.post function is been used for mapping the function {handler} to  the new path

//Now we will start writing our protected routes
//Protected Routes - Middlewares
//We are assigned with the different different roles and each role is assigned with a specific permission

//Lets just make a testing route with just one middleware
//test route
router.get("/test" , auth , (req , res) => {
    res.json({
        success:true,
        message : "Welcome to the Protected Routes for the Tests"
    })
})

router.get("/student" , auth , isStudent , (req , res) => {
    res.json({
        success : true,
        message : " Welcome to the Protected Route for Students"
    })
})

router.get("/admin" , auth , isAdmin , (req , res) => {
    res.json({
        success : true,
        message : "Welcome to the protected route for the admin",
    })
})

//How do we get to know the logined user is the student when we passed the token  to the login user in that token there was onething known as payload and in the payload we have passed the role module so we will take the token decrypt it get the role from it and then Authorise the student 

module.exports = router;



