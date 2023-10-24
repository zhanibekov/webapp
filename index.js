import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send(' Hello world!!!!');
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);
    const token = jwt.sign({
            fullName: "Zhunisali Shanabek",
        },
        'secret123',
    );
    res.json({
        email: req.body.email,
        success: true,
        token,
    });
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is working');
});