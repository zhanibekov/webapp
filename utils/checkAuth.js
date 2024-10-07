import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    console.log('Token:', token);

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            console.log('Decoded userId:', decoded._id); // Логируем userId
            next();
        } catch (e) {
            console.error('JWT error:', e); // Логируем ошибку
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        console.log('No token provided');
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
};