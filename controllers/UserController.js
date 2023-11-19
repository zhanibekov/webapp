import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModels from '../models/User.js'

export const register = async(req, res) => {
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
};

export const login = async(req, res) => { ///АВТОРИЗАЦИЯ ПОЛЬЗВАТЕЛЯ///
    try {
        const user = await UserModels.findOne({ email: req.body.email }) ///ПОИСК ПОЛЬЗАТЕЛЯ///
        if (!user) {
            return res.status(404).json({
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

};

export const getMe = async(req, res) => { ///ИНФОРМАЦИЯ О ПОЛЬЗВАТЕЛЕ///
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
}