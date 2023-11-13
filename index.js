import express from 'express';
import mongoose, { connect } from 'mongoose';
import { registerValidator } from './validations/Auth.js'

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js'
import User from './models/User.js';
mongoose.
connect('mongodb+srv://elamanzhanibekov:2006@cluster0.oqzqyvs.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB is working!'))
    .catch((err) => console.log('DB IS ERROR', err))

const app = express();
app.use(express.json());

app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidator, UserController.register);
app.get('/auth/me', UserController.getMe);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is working');
});