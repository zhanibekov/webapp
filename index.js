import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
const app = express();
import cors from 'cors';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.use(express.static(path.join(__dirname, 'public')));

import { config } from 'dotenv';
import mongoose from 'mongoose';
import { registerValidator, loginValidation, postCreateValidation } from './validations.js'

import { checkAuth, handleValidationErrors } from './utils/index.js';


import { UserController, PostController } from './controllers/index.js'

config();
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 4444;

mongoose.connect(MONGODB_URL).then(() => console.log('DB, ok!')).catch((err) => console.log('DB, error!', err))

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
app.get('https://zhanibekov-blog-1852139b3b81.herokuapp.com/api/posts', PostController.getAll);
app.get('posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, handleValidationErrors, postCreateValidation, PostController.create);
app.delete('/posts/:id', PostController.remove);
app.patch('/posts/:id', checkAuth, handleValidationErrors, postCreateValidation, PostController.update);



app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }

    return console.log("OK!")
})