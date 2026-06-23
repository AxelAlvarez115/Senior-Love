import sequelize from "../database/database.js";
import validator from 'validator';
import { Comment, Event, User } from "../models/index.js";

const commentController = {
    create: async (req, res) => {
        try {
            const eventId = req.params.event;
            const userId = req.session.userId;
            const contents = req.body.contents;
            if(!contents || validator.isEmpty(contents)) {
                res.json({success: false});
            }
            else {
                const newComment = await Comment.create({
                    contents: contents,
                    event_id: eventId,
                    user_id: userId
                });
                const comment = await Comment.findByPk(newComment.id, {include:[{model: User, as:'User', attributes:['id', 'firstname', 'lastname']}]});
                res.json({success: true, comment: comment});
            }
        }
        catch(error) {
            console.log(error, req.params, req.session.userId, req.body.contents);
            res.status(500).json({success: false});
        }
    },
    findByPk: async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.com, { include: User });
            res.json(comment);
        }
        catch(error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.com);
            if (!comment) {
                return res.status(404).json({success: false, error: 'Commentaire introuvable'});
            }
            const userId = req.session.userId;
            if (comment.user_id === userId || req.session.isAdmin) {
                await comment.destroy();
                res.json({success: true});
            }
            else {
                res.status(403).json({success: false});
            }
        }
        catch(error) {
            console.log(error);
            res.status(500).json({success: false});
        }
    }         
}

export default commentController;