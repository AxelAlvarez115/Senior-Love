# Intégration Socket.io — Senior Love

## Pourquoi Socket.io ?

Socket.io gère en temps réel deux fonctionnalités prévues dans le projet :
- **Notifications** — demande de contact, acceptation de contact
- **Chat instantané** — à implémenter par la suite

Un seul serveur Socket.io câble les deux canaux, ce qui évite un refactoring plus tard.

---

## Ce qui a été fait

### 1. Installation

```bash
npm install socket.io
```

---

### 2. [index.js](index.js)

Trois changements par rapport à l'original :

**Imports ajoutés**
```js
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./app/socket.js";
```

**Session extraite en variable** pour être partagée avec Socket.io
```js
const sessionMiddleware = session({ ... });
app.use(sessionMiddleware);
```

**Serveur HTTP + Socket.io** à la place de `app.listen`
```js
const httpServer = createServer(app);
const io = new Server(httpServer);
initSocket(io, sessionMiddleware);
export { io };

httpServer.listen(port, () => { ... });
```

---

### 3. [app/socket.js](app/socket.js) — events Socket.io

```js
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
        // Chaque user rejoint sa room privée identifiée par son id
        socket.join(`user:${socket.userId}`);

        // --- Notifications (à câbler dans les controllers) ---
        // io.to(`user:${destinataireId}`).emit("notification:new", data)

        // --- Chat (à compléter plus tard) ---
        // socket.on("chat:message", (data) => { ... })

        socket.on("disconnect", () => {});
    });
}
```

---

### 4. [public/js/socket.js](public/js/socket.js) — client

```js
const socket = io();

socket.on("notification:new", (data) => {
    console.log("Nouvelle notification :", data);
    // Mettre à jour le badge dans le header, afficher un toast, etc.
});
```

À inclure dans le layout principal avant `</body>` :
```html
<script src="/socket.io/socket.io.js"></script>
<script src="/js/socket.js"></script>
```

---

## À faire ensuite

### Notifications de contact

Dans [app/controllers/mainController.js](app/controllers/mainController.js), importer `io` et émettre aux deux endroits clés de `meetingProfilAdd()` :

```js
import { io } from "../../index.js";

// Demande envoyée → notifier le destinataire
io.to(`user:${contactId}`).emit("notification:new", {
    type: "contact_request",
    senderName: currentUser.firstname,
});

// Acceptation mutuelle → notifier le demandeur
io.to(`user:${requesterId}`).emit("notification:new", {
    type: "contact_accepted",
    senderName: currentUser.firstname,
});
```

### Modèle Notification (persistance)

Créer [app/models/notification.js](app/models/notification.js) pour stocker les notifications non lues :

| Champ | Type | Description |
|---|---|---|
| `recipient_id` | INTEGER | Destinataire |
| `sender_id` | INTEGER | Expéditeur |
| `type` | ENUM | `contact_request` / `contact_accepted` |
| `read` | BOOLEAN | Lu ou non |

### Chat

Dans [app/socket.js](app/socket.js), compléter la section chat :

```js
socket.on("chat:message", ({ to, message }) => {
    io.to(`user:${to}`).emit("chat:message", {
        from: socket.userId,
        message,
    });
});
```

---

## Nomenclature des commits

| Préfixe | Usage |
|---|---|
| `ADD` | Ajout d'une nouvelle fonctionnalité |
| `UPDATE` | Modification de l'existant |
| `FIX` | Résolution de bug |
