//Import the bcrypt library. It will be used inorder to hash the password 
//In the controllers we need to import the models in order to interact with the Database

const bcrypt = require("bcrypt");
const User = require("../Model/User");

//Making the signup routed handler 
exports.signup = async (req , res) => {
    try{
        //get the data
        const {name , email , password , role} = req.body;
        //Check if the entry already present (User already exists) If any entry is found then throw that entry on the first call
        const existingUser = await user.findOne({email});

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