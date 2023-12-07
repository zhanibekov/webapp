import { validationResult } from 'express-validator';

export default (req, res, next) => { //// Если валидация не прошла то верни мне ошибку, или же next();///
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())

    }
    next();
}