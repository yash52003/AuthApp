//Import the bcrypt library. It will be used inorder to hash the password 
//In the controllers we need to import the models in order to interact with the Database

const bcrypt = require("bcrypt");
const User = require("../Model/User");
const jwt = require('jsonwebtoken');
require("dotenv").config();

//Making the signup routed handler 
exports.signup = async (req , res) => {
    try{
        //get the data
        const {name , email , password , role} = req.body;
        //Check if the entry already present (User already exists) If any entry is found then throw that entry on the first call
        const existingUser = await User.findOne({email});

        if(existingUser){
            //If a valid entry is present 
            return res.status(400).json({
                success:false,
                message : "User already Exists",
            });
        }

        //Secure the password 
        //We need to secure the password. For securing the password we use the method of hashing 

        let hashedPassword;
        try{
            //The bcrypt.hash() ->
            /*function cotains 2 arguments 
            1st argument -> The data we want to hash
            2nd argument -> The no of salt rounds (hashing rounds).
            10 is the general rounds no that we use in our project 
            */
            hashedPassword = await bcrypt.hash(password , 10);

        }
        catch(err){
            return res.status(500).json({
                success : false,
                message : "Error in hashing Password",
            })
        }

        //Create entry for the User
        //Using the .create() function we have created an entry in the DB
        const user = await User.create({
            name , email , password:hashedPassword , role
        })

        return res.status(200).json({
            success:true,
            message:"User Created Success",
        });


    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, Please try again later"
        })
    }
}


/*
Steps:
Make the signup function 
-> Get the request and the response 
-> {name , email , password , role} extract these information from the request 
-> Check the entry is present in the User {Findone Function} 
-> If the user is existing then just return directly 
-> Hashed Password : Create the Hashed Password using the bcrypt library bcrypt.hash(password , 10) in the try-catch block 
-> Create the abject and insert in the Database in the User model
*/

//Let's write a handler for login 
exports.login = async(req , res) => {
    try{
       //Fetching the data for the request body -> Destructuring of the object into the variables
       const {name , email ,  password , role} = req.body;
       //validation on email on password
       if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Please Fill the details carefully",
            });
       }

       //Cheak if the user is available or not - cheak that on the basis of email any entry in the database is present or not  
       let user = await User.findOne({email});
       //If not the registered user
       if(!user){
        return res.status(401).json({
            success:false,
            message:"Not a signed in user First Signin then come to the Login page",
        })
       }

       //Which status code to exit code to send decide on the basis of documentation

        //verify the password & generate the JWT token 
        const payload = {
            email : user.email,
            id : user._id,
            role: user.role,
        }

        if(await bcrypt.compare(password , user.password)){
            //Password has matched 
            //If the password has created than we need to login it and give the credential by jwt token
            // payload , secretkey , [options , callback]
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn : "2h",
            } );
            //Now the token is been created 
            // We create a new field named token in the userObject and then send it to the user we need to restrict the password if he is an hacker
            user = user.toObject();
            user.token = token;

            //We are removing the password from the user object that we have created not from the database
            user.password = undefined;

            //Lets sent the response in the form of the cookie
            //cookie requires three parameters 
            //Name of the cookie , cookie data , some options - cookie validity , cookie expiry 
            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly : true,
            }

            res.cookie("token" , token , options).status(200).json({
                success : true,
                token,
                user,
                message : "User logged in Successfully ",
            })

        }
        else{
            //Password don't match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Login Failure"
        });
    }

}
