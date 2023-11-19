import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); ///ВЫТАСКИВАЮ ИЗ ХЭДЕРА АВТОРИЗАЦИЮ,ЗАМИНЯЮ BEARER на пустую строку///

    if (token) { ///ЕСЛИ ЕСТЬ ТОКЕН Я ЕГО РАССШИФРУЮ///
        try {
            const decoded = jwt.verify(token, 'secret123'); ///В verify я передаю токен и с ключом(secret123) с которым я буду расшифрововать токен///

            req.userId = decoded._id; /// В ЗАПРОС userId я передаю расшифрованный id и вытаскиваю его///
            next(); ///ВЫПОЛНЯЙ ДАЛЬШЕ///
        } catch (e) { ///ЕСЛИ ЖЕ Я ПОЙМАЮ ОШИБКУ ТО ПОКАЗЫВАЮ ОШИБКУ///
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
};