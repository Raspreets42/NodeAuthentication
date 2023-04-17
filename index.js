const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const connectDB = require("./db/connect");

const bcrypt = require('bcrypt');
const User = require('./model/schema');

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use('/' , express.static(path.join(__dirname,'static')));
app.use(cors( {origin: '*' }));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/api/changepassword' , async (req,res) => {
    const { userNewPassword , userCNewPassword  , token} = req.body;
    if(userNewPassword !== userCNewPassword){
        res.json({status:'error' , error: 'Password does not got matched.'})
    }
    try {
        const user = jwt.verify(token,JWT_SECRET);
        const _id = user.id;
        const hashedPass = await bcrypt.hash(userNewPassword , 10);
        const hashedCPass = await bcrypt.hash(userCNewPassword , 10);
        console.log(user);

        await User.updateOne({_id},{
            $set : {userPassword : hashedPass},
            $set : {userCPassword : hashedCPass},
        })
        res.json({status: 'ok' , msg: 'Password changed successfully'})
    } catch (error) {
        res.json({status: 'error', error: 'Failed to respond'});
    }

});

app.post('/api/login' , async (req,res) => {
    const { userEmail , userPassword } = req.body;

    const user = await User.findOne({ userEmail });
    
    if(!user){
        return res.json({status:'error',error: 'Invalid User email or/and password'});
    }

    if(await bcrypt.compare(userPassword , user.userPassword)){

        const token = jwt.sign(
            {
                id: user._id,
                userEmail: user.userEmail,
            },
            JWT_SECRET
        )
        localStorage.setItem('token',token);
        return res.json({status:'Ok' , msg: 'User logged-in' , token: token});
    }

    res.json({status:'error',error: 'Invalid User email or/and password'});
})

app.post('/api/register' , async (req,res) => {
    
    const { userName , userEmail , userPhone , userPassword , userCPassword } = req.body;

    if (userName === '' || userEmail === '' || userPhone === '' || userPassword === '' || userCPassword === '') {
        res.json({
            status: 500,
            message: 'Please fill all the required fields'
        })
        return
    }else if (userPassword !== userCPassword) {
        res.json({
            status: 401,
            message: 'Password does not matches'
        })
        return
    }

    const userHashedPassword = await bcrypt.hash(userPassword , 10);
    const userHashedCPassword = await bcrypt.hash(userCPassword , 10);
    
    try {
        const resp = await User.create({ 
            userName ,
            userEmail ,
            userPhone ,
            userPassword: userHashedPassword ,
            userCPassword: userHashedCPassword
        } );
        console.log('resp : ' , resp);
        res.json({status:'success' , message: 'Successfully Registered'});
    } catch (err) {
        res.json({status: 'Error' , message: err.message });
    }
})

const start = async() => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        })
    } catch (err) {
        console.log(err);
    }
}

start();