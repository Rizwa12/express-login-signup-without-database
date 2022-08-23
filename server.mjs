import express from "express"
import cors from "cors"
import { nanoid } from 'nanoid'
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 3000;

const userschema = new mongoose.Schema({ 
    firstName: String, 
    lastName: String,
    email: String,
    password: {type:String,required:true},
    age: {type:Number,min:17, max:65,default:18},
    subjects: Array,
    isMarried: {type:Boolean,deault:false},
    createdOn:{type: Date, default: Date.now },
 });
const userModel = mongoose.model('user', userschema);

app.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    let newUser = new userModel({
        
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email.toLowerCase(),
        password: body.password
    })

    newUser.save((err,result)=>{
        if(!err){
            //data saved
            console.log("data saved:",result);
            res.status(201).send({ message: "user is created" });
            
        }
        else
        {
            console.log("db error:",err);
            res.status(500).send({message:"internal server error"});
        }

    });

    
});

app.post("/login", (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    let isFound = false; // https://stackoverflow.com/a/17402180/4378475

    for (let i = 0; i < userBase.length; i++) {
        if (userBase[i].email === body.email) {

            isFound = true;
            if (userBase[i].password === body.password) { // correct password

                res.status(200).send({
                    firstName: userBase[i].firstName,
                    lastName: userBase[i].lastName,
                    email: userBase[i].email,
                    message: "login successful",
                    token: "some unique token"
                })
                return;

            } else { // password incorrect

                res.status(401).send({
                    message: "incorrect password"
                })
                return;
            }
        }
    }

    if (!isFound) {
        res.status(404).send({
            message: "user not found"
        })
        return;
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



///////////////////////////////////
//mongoose.connect('mongodb+srv://abc:abc@cluster0.dcy08cl.mongodb.net/?retryWrites=true&w=majority');
let dbURI = 'mongodb+srv://abc:abc@cluster0.dcy08cl.mongodb.net/socialmediaserver?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});
process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});