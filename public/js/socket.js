const socket = io();

// Écoute les notifications entrantes
socket.on("notification:new", (data) => {
    console.log("Nouvelle notification :", data);
    // Mettre à jour le badge dans le header, afficher un toast, etc.
});
