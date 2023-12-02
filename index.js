import express from 'express';
import mongoose from 'mongoose';
import { registerValidator, loginValidation, postCreateValidation } from './validations.js'

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose.
connect('mongodb+srv://elamanzhanibekov:2003@cluster0.oqzqyvs.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB is working!'))
    .catch((err) => console.log('DB IS ERROR', err))

const app = express();
app.use(express.json());

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidator, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is working');
});