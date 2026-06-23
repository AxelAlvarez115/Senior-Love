import { Message, User_Relationship } from "./models/index.js";

const MAX_MESSAGE_LENGTH = 2000;

export function initSocket(io, sessionMiddleware) {

    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    io.use((socket, next) => {
        const userId = socket.request.session?.userId;
        if (!userId) return next(new Error("Non authentifié"));
        socket.userId = userId;
        next();
    });

    io.on("connection", (socket) => {
        socket.join(`user:${socket.userId}`);

        socket.on("chat:message", async ({ to, message }) => {
            const recipientId = Number(to);
            if (!Number.isInteger(recipientId) || recipientId <= 0) return;
            if (recipientId === socket.userId) return;
            if (!message || !message.trim()) return;

            const content = message.trim().slice(0, MAX_MESSAGE_LENGTH);

            // Vérifie que le destinataire fait bien partie des contacts de l'expéditeur
            const relationship = await User_Relationship.findOne({
                where: { user_id: socket.userId, contact_id: recipientId },
            });
            if (!relationship) return;

            const saved = await Message.create({
                sender_id: socket.userId,
                recipient_id: recipientId,
                content,
            });

            const payload = {
                id: saved.id,
                from: socket.userId,
                to: recipientId,
                message: saved.content,
                createdAt: saved.createdAt,
            };

            io.to(`user:${recipientId}`).emit("chat:message", payload);
            io.to(`user:${socket.userId}`).emit("chat:message", payload);
        });

        socket.on("disconnect", () => {});
    });
}
