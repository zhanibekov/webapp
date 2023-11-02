import { body } from 'express-validator'

export const registerValidator = [ //Передаю данные пользвателя///
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 }),
    body('avatarUrl').optional().isURL(),
];