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
import Post from './models/Post.js'; // Проверьте путь к файлу модели

import mongoose from 'mongoose';
import { registerValidator, loginValidation, postCreateValidation } from './validations.js'

import Comment from './models/Comment.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';


import { UserController, PostController } from './controllers/index.js'

config();

mongoose.connect('mongodb+srv://yelaman:2003@cluster0.oqzqyvs.mongodb.net/').then(() => console.log('DB, ok!')).catch((err) => console.log('DB, error!', err))

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
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/popular', PostController.getPopular)
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, handleValidationErrors, postCreateValidation, PostController.create);
app.delete('/posts/:id', PostController.remove);
app.patch('/posts/:id', checkAuth, handleValidationErrors, postCreateValidation, PostController.update);
app.post('/posts/:id/comments', checkAuth, async(req, res) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        const comment = new Comment({
            postId,
            text,
            user: req.userId,
        });

        await comment.save();
        post.comments.push(comment._id);
        await post.save();

        res.json(comment);
    } catch (err) {
        console.log(err); // Логируем ошибку
        res.status(500).json({
            message: 'Ошибка, не удалось добавить комментарий',
        });
    }
});





app.
listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    return console.log("OK!")
})