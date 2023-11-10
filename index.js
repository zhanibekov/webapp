import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { connect } from 'mongoose';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { registerValidator } from './validations/Auth.js'

import UserModels from './models/User.js'
import checkAuth from './utils/checkAuth.js';
import User from './models/User.js';

mongoose.
connect('mongodb+srv://elamanzhanibekov:2006@cluster0.oqzqyvs.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB is working!'))
    .catch((err) => console.log('DB IS ERROR', err))

const app = express();
app.use(express.json());

app.post('/auth/login', async(req, res) => { ///АВТОРИЗАЦИЯ ПОЛЬЗВАТЕЛЯ///
    try {
        const user = await UserModels.findOne({ email: req.body.email }) ///ПОИСК ПОЛЬЗАТЕЛЯ///
        if (!user) {
            return req.status(404).json({
                message: 'Пользватель не найден',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); ///ЗДЕСЬ ЕСЛИ ПОЛЬЗВАТЕЛЬ НАШЕЛСЯ В БАЗЕ ДАННЫХ,ТО СРАВНИВАЮ ВВЕДЕННЫЙ ПАРОЛЬ В ТЕЛЕ ЗАПРОСА,И В ДОКУМЕНТЕ ПОЛЬЗВАТЕЛЯ CХОДЯТСЯ ЛИ ОНИ
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный пароль или Логин',
            });
        }
        const token = jwt.sign({ /// ШИФРУЮ ИНФОРМАЦИЮ ПОЛЬЗВАТЕЛЯ ///
                _id: user._id,
            },
            'secret123', /// ВТОРОЙ ПАРАМЕТР ЩИФРУЮ ТОКЕН С ПОМОЩЬЮ КЛЮЧА ///
            {
                expiresIn: '30d', /// ТРЕТИЙ ПАРАМЕТР СРОК ХРАНЕНИЯ ТОКЕНА ///
            },
        );

        const { passwordHash, ...userData } = user._doc /// ПАРОЛЬ НЕ ВИДЕН, УБИРАЮ const PasswordHash будет видно///
        res.json({ /// ВОЗВРАЩАЮ ИНФОРМАЦИЮ ПОЛЬЗВАТЕЛЯ И ТОКЕН ///
            ...userData, /// (user._doc) чтобы мне был виден пароль ////
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }

})

app.post('/auth/register', registerValidator, async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password; ///////ВЫТСКИВАЮ ПАРОЛЬ из req.body////
        const salt = await bcrypt.genSalt(10); //АЛГОРИТМ ШИФРОВАНИЯ ПАРОЛЯ///////
        const hash = await bcrypt.hash(password, salt) //ЗДЕСЬ ХРАНЯТСЯ ЗАШИФРОВАННЫЕ ПАРОЛИ////


        const doc = new UserModels({ ///////////СОЗДАЮ ДОКУМЕНТ ПОЛЬЗВАТЕЛЯ////////////
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });
        const user = await doc.save(); /// CОХРАНЯЮ ПОЛЬЗВАТЕЛЯ В БАЗЕ ДАННЫХ ///

        const token = jwt.sign({ /// ШИФРУЮ ИНФОРМАЦИЮ ПОЛЬЗВАТЕЛЯ ///
                _id: user._id,
            },
            'secret123', /// ВТОРОЙ ПАРАМЕТР ЩИФРУЮ ТОКЕН С ПОМОЩЬЮ КЛЮЧА ///
            {
                expiresIn: '30d', /// ТРЕТИЙ ПАРАМЕТР СРОК ХРАНЕНИЯ ТОКЕНА ///
            },
        );
        const { passwordHash, ...userData } = user._doc /// ПАРОЛЬ НЕ ВИДЕН, УБИРАЮ const PasswordHash будет видно///
        res.json({ /// ВОЗВРАЩАЮ ИНФОРМАЦИЮ ПОЛЬЗВАТЕЛЯ И ТОКЕН ///
            ...userData, /// (user._doc) чтобы мне был виден пароль ////
            token,
        });

    } catch (err) { ///ЗДЕСЬ Я ЛОВЛЮ ОШИБКУ И ВОЗВРАЩАЮ ЗНАЧЕНИЯ///
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
});

app.get('/auth/me', checkAuth, async(req, res) => { ///ИНФОРМАЦИЯ О ПОЛЬЗВАТЕЛЕ///
    try {
        const user = await UserModels.findById(req.userId); //НАЙТИ ПОЛЬЗВАТЕЛЯ В БАЗЕ ДАННЫХ///
        if (!user) { /// ЕСЛИ ПОЛЬЗВАТЕЛЬ НЕ НАШЕЛСЯ ПОКАЖИ МНЕ ОШИБКУ ///
            return res.status(404).json({
                message: 'Пользватель не найден'
            });
        }
        const { passwordHash, ...userData } = user._doc /// ПАРОЛЬ НЕ ВИДЕН, УБИРАЮ const PasswordHash будет видно///
        res.json(userData);
    } catch (err) {
        res.status(500).json({
            message: 'Ошибка не доступа'
        });
    }
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is working');
});