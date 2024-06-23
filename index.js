import express from 'express';
import multer from 'multer';
import cors from 'cors';


import mongoose from 'mongoose';
import { registerValidator, loginValidation, postCreateValidation } from './validations.js'

import { checkAuth, handleValidationErrors } from './utils/index.js';


import { UserController, PostController } from './controllers/index.js'

mongoose.
connect(process.env.MONGODB_URI = "mongodb+srv://elamanzhanibekov:2003@cluster0.oqzqyvs.mongodb.net/blog?retryWrites=true&w=majority")
    .catch((err) => console.log('DB IS ERROR', err))


const app = express();
app.use(express.json());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
app.use('/uploads', express.static('uploads'))
const upload = multer({ storage })
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});


app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, handleValidationErrors, postCreateValidation, PostController.create);
app.delete('/posts/:id', PostController.remove);
app.patch('/posts/:id', checkAuth, handleValidationErrors, postCreateValidation, PostController.update);

app.get('/*/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})
app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is working');
});