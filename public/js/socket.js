// Nom de variable distinct de "socket" (utilisé dans chat.js) pour éviter
// un conflit de redéclaration lorsque les deux scripts sont chargés sur la page de conversation.
const notificationSocket = io();

const messagesBadge = document.getElementById("messages-badge");
const currentUserId = messagesBadge ? Number(messagesBadge.dataset.userId) : null;

notificationSocket.on("notification:new", (data) => {
    showNotificationBadge(data);
});

notificationSocket.on("chat:message", (data) => {
    updateMessagesBadge(data);
});

function updateMessagesBadge(data) {
    if (!messagesBadge || currentUserId === null) return;
    // On ignore les messages que l'on a soi-même envoyés
    if (data.from === currentUserId) return;
    // Si on est déjà sur la conversation de l'expéditeur, le message est considéré comme lu
    if (window.location.pathname === `/messages/${data.from}`) return;

    const count = Number(messagesBadge.dataset.count || "0") + 1;
    messagesBadge.dataset.count = count;
    messagesBadge.textContent = count;
    messagesBadge.classList.remove("hidden");
}

function showNotificationBadge(data) {
    // Seule une nouvelle demande de contact reçue incrémente la pastille du bouton Compte
    if (data.type === "contact_request") {
        const badge = document.getElementById("contacts-badge");
        if (badge) {
            const count = Number(badge.dataset.count || "0") + 1;
            badge.dataset.count = count;
            badge.textContent = count;
            badge.classList.remove("hidden");
        }
    }

    const label = data.type === "contact_request"
        ? `${data.senderName} vous a envoyé une demande de contact.`
        : `${data.senderName} a accepté votre demande de contact.`;

    showToast(label);
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
