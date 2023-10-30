import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { connect } from 'mongoose';

mongoose.
connect('mongodb+srv://elamanzhanibekov:2006@cluster0.oqzqyvs.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB is OK!'))
    .catch((err) => console.log('DB is error', err));

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