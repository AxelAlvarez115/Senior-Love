import { Op } from "sequelize";
import { User, Message } from "../models/index.js";

const chatController = {

    inbox: async function (req, res) {
        try {
            const userId = req.session.userId;
            const currentUser = await User.findByPk(userId, {
                include: [{ model: User, as: "contacts", attributes: ["id", "firstname", "lastname", "city"] }]
            });
            const contacts = currentUser.contacts;

            const conversations = await Promise.all(contacts.map(async (contact) => {
                const lastMessage = await Message.findOne({
                    where: {
                        [Op.or]: [
                            { sender_id: userId, recipient_id: contact.id },
                            { sender_id: contact.id, recipient_id: userId },
                        ]
                    },
                    order: [["createdAt", "DESC"]],
                });
                const unreadCount = await Message.count({
                    where: { sender_id: contact.id, recipient_id: userId, read: false }
                });
                return { contact, lastMessage, unreadCount };
            }));

            conversations.sort((a, b) => {
                const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : 0;
                const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : 0;
                return dateB - dateA;
            });

            res.render("chat-inbox", { conversations });
        } catch (error) {
            console.log(error);
        }
    },

    conversation: async function (req, res) {
        try {
            const userId = req.session.userId;
            const contactId = Number(req.params.contactId);

            const currentUser = await User.findByPk(userId, {
                include: [{ model: User, as: "contacts", attributes: ["id"] }]
            });
            const isContact = currentUser.contacts.some(c => c.id === contactId);
            if (!isContact) return res.redirect("/messages");

            const contact = await User.findByPk(contactId);
            if (!contact) return res.redirect("/messages");

            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { sender_id: userId, recipient_id: contactId },
                        { sender_id: contactId, recipient_id: userId },
                    ]
                },
                order: [["createdAt", "ASC"]],
            });

            await Message.update(
                { read: true },
                { where: { sender_id: contactId, recipient_id: userId, read: false } }
            );

            res.render("chat-conversation", { contact, messages, currentUserId: userId });
        } catch (error) {
            console.log(error);
        }
    },
};

export default chatController;
