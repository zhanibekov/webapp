import { body } from 'express-validator'

export const loginValidation = [ //Передаю данные пользвателя///
    body('email', 'Неверный формат почты').isEmail(),
    body('password', "Пароль должен быть минимум 5 символов").isLength({ min: 5 }),
];

export const registerValidator = [ //Передаю данные пользвателя///
    body('email', 'Неверный формат почты').isEmail(),
    body('password', "Пароль должен быть минимум 5 символов").isLength({ min: 5 }),
    body('fullName', 'Укажите имя').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [ //Передаю данные(валидация) статьи//
    body('title', 'Введите загаловок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тэгов(укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображения').optional().isString(),
];