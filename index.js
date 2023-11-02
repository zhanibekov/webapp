import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { connect } from 'mongoose';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { registerValidator } from './validations/Auth.js'
import UserModels from './models/User.js'

mongoose.
connect('mongodb+srv://elamanzhanibekov:2006@cluster0.oqzqyvs.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB is working!'))
    .catch((err) => console.log('DB IS ERROR', err))

const app = express();
app.use(express.json());


app.post('/auth/register', registerValidator, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password; ///////ВЫТСКИВАЮ ПАРОЛЬ из req.body////
    const salt = await bcrypt.genSalt(10); //АЛГОРИТМ ШИФРОВАНИЯ ПАРОЛЯ///////


    const doc = new UserModel({ ///////////СОЗДАЮ ДОКУМЕНТ////////////
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: req.body.avatarUrl
    });
    res.json({
        success: true,
    });
});


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is working');
});