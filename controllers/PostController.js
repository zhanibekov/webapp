import PostModel from '../models/Post.js'

export const getLastTags = async(req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)
        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить тэги'
        });
    }
};

export const getAll = async(req, res) => {
    try {
        const posts = await PostModel.find().populate({ path: 'user' }).exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async(req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: { viewsCount: 1 },
        }, {
            returnDocument: "after",
        }).populate({ path: 'user' }).exec().then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Не удалось вернуть статью",
                });
            }
            if (!doc) {
                return res.status(404).json({
                    message: "Статья не найдена",
                });
            }
            res.json(doc);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const remove = async(req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndDelete({ _id: postId });
        if (doc) { // Will be null if no match
            res.status(200).json({
                success: true,
            });
        } else {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось удалить статью",
        });
    }
};





export const create = async(req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const update = async(req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        }, );
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
}

export const getPopular = async(req, res) => {
    try {
        const posts = await PostModel.find().sort({ viewsCount: -1 }).limit(10).populate({ path: 'user' }).exec();
        res.json(posts);
    } catch {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить популярные статьи',
        })

    }
}