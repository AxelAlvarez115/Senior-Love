// Assistance par message — enchaînement des trois états de la mise en relation.
// Le résultat est simulé : aucun conseiller n'est réellement joignable pour le
// moment. La durée d'attente est volontairement perceptible pour que
// l'utilisateur comprenne qu'une recherche est en cours.

const ETATS = {
    idle: document.getElementById('support-idle'),
    waiting: document.getElementById('support-waiting'),
    unavailable: document.getElementById('support-unavailable'),
};

const live = document.getElementById('support-live');
const boutonDemander = document.getElementById('support-start');
const boutonRelancer = document.getElementById('support-retry');

// Durée de la recherche, en millisecondes
const DUREE_RECHERCHE = 4500;

// Les personnes ayant activé la réduction des animations n'ont pas besoin
// d'attendre aussi longtemps : le message compte plus que l'effet.
const animationsReduites = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let minuteur = null;

function afficher(nom) {
    Object.entries(ETATS).forEach(([cle, element]) => {
        if (!element) return;
        element.classList.toggle('support--hidden', cle !== nom);
    });
}

// Annonce le changement d'état aux lecteurs d'écran, sans quoi la transition
// serait totalement silencieuse pour une personne malvoyante.
function annoncer(message) {
    if (live) live.textContent = message;
}

function lancerRecherche() {
    afficher('waiting');
    annoncer('Recherche d\'un conseiller disponible, merci de patienter.');

    clearTimeout(minuteur);
    minuteur = setTimeout(() => {
        afficher('unavailable');
        annoncer('Aucun conseiller n\'est disponible pour le moment. '
               + 'Vous pouvez relancer la demande ou nous appeler.');
    }, animationsReduites ? 1200 : DUREE_RECHERCHE);
}

if (boutonDemander) {
    boutonDemander.addEventListener('click', lancerRecherche);
}

if (boutonRelancer) {
    boutonRelancer.addEventListener('click', lancerRecherche);
}

// Si l'utilisateur quitte la page pendant la recherche, on annule le minuteur
window.addEventListener('pagehide', () => clearTimeout(minuteur));
