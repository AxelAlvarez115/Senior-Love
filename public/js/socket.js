const socket = io();

socket.on("notification:new", (data) => {
    showNotificationBadge(data);
});

function showNotificationBadge(data) {
    const badge = document.getElementById("notification-badge");
    if (badge) {
        const count = parseInt(badge.textContent || "0") + 1;
        badge.textContent = count;
        badge.classList.remove("hidden");
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
