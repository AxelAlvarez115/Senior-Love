const socket = io();
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const messagesContainer = document.getElementById("chatMessages");

scrollToBottom();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    socket.emit("chat:message", { to: CONTACT_ID, message });
    input.value = "";
});

socket.on("chat:message", (data) => {
    if (
        (data.from === CURRENT_USER_ID && data.to === CONTACT_ID) ||
        (data.from === CONTACT_ID && data.to === CURRENT_USER_ID)
    ) {
        appendMessage(data);
        scrollToBottom();
    }
});

function appendMessage(data) {
    const isMine = data.from === CURRENT_USER_ID;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${isMine ? "chat-bubble--mine" : "chat-bubble--theirs"}`;

    const time = new Date(data.createdAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    bubble.innerHTML = `
        <p class="chat-bubble__text">${escapeHtml(data.message)}</p>
        <span class="chat-bubble__time">${time}</span>
    `;
    messagesContainer.appendChild(bubble);
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
