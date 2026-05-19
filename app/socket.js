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

        // --- Notifications (à câbler dans les controllers) ---
        // io.to(`user:${destinataireId}`).emit("notification:new", data)

        // --- Chat (à compléter plus tard) ---
        // socket.on("chat:message", (data) => { ... })

        socket.on("disconnect", () => {});
    });
}
