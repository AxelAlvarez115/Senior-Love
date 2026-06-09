export function initSocket(io, sessionMiddleware) {

    // Partage la session Express avec Socket.io
    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    // Vérifie que l'utilisateur est connecté
    io.use((socket, next) => {
        const userId = socket.request.session?.userId;
        if (!userId) return next(new Error("Non authentifié"));
        socket.userId = userId;
        next();
    });

    io.on("connection", (socket) => {
        // Chaque user rejoint sa "room" privée identifiée par son id
        socket.join(`user:${socket.userId}`);

        socket.on("chat:message", ({ to, message }) => {
            io.to(`user:${to}`).emit("chat:message", {
                from: socket.userId,
                message,
            });
        });

        socket.on("disconnect", () => {});
    });
}
