import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId, // Указывает, что поле должно быть типа ObjectId
        ref: 'Post', // Указывает, что это поле ссылается на коллекцию 'Post'
        required: true // Это поле обязательно
    },
    text: {
        type: String, // Указывает, что поле должно быть строкой
        required: true // Это поле обязательно
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Указывает, что поле должно быть типа ObjectId
        ref: 'User', // Указывает, что это поле ссылается на коллекцию 'User'
        required: true // Это поле обязательно
    },
}, {
    timestamps: true // Создаёт поля createdAt и updatedAt для отслеживания времени создания и обновления документа
});

// Создаём модель 'Comment' на основе схемы
const Comment = mongoose.model('Comment', CommentSchema);

// Экспортируем модель для использования в других частях приложения
export default Comment;