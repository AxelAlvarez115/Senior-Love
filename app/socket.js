import { Message } from "./models/index.js";

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
            if (!to || !message || !message.trim()) return;

            const saved = await Message.create({
                sender_id: socket.userId,
                recipient_id: to,
                content: message.trim(),
            });

            const payload = {
                id: saved.id,
                from: socket.userId,
                to,
                message: saved.content,
                createdAt: saved.createdAt,
            };

            io.to(`user:${to}`).emit("chat:message", payload);
            io.to(`user:${socket.userId}`).emit("chat:message", payload);
        });

        socket.on("disconnect", () => {});
    });
}
