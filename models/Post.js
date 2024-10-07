////////////////СХЕМА СТАТЬИ////////////////
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: { ////Загаловок////
        type: String,
        required: true,
    },
    text: { ////Текст//////            
        type: String,
        required: true,
        unique: true,
    },
    tags: { ////Тэги/////
        type: Array,
        default: [],
    },
    viewsCount: { ////Просмотры////
        type: Number,
        default: 0,
    },
    user: { ////Автор////
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    imageUrl: String,
}, {
    timestamps: true,
}, );
export default mongoose.model('Post', PostSchema);