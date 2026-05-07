const darkBackground = document.querySelector('.darkBackground');
const formsButton = document.querySelector('#formsButton');
const cancelButton = document.querySelector('.forms__cancel');

const formsAll = document.querySelectorAll('.form');
const switButtons = document.querySelectorAll('.forms__switch__button');

const formTitle = document.querySelector('.forms__content__title');

const TITLES = {
    infoForm: 'Modifier les informations de votre compte',
    emailForm: "Changer l'email du compte",
    passwordForm: 'Modifier le mot de passe de votre compte',
    deleteForm: 'Supprimer votre compte'
};

switButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        if (formTitle && TITLES[target]) {
            formTitle.textContent = TITLES[target];
        }
        switButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        for (const form of formsAll) {
            if (target === form.id) {
                form.classList.remove('hidden');
            }
            else {
                form.classList.add('hidden');
            }
        }
    });
});

if (formsButton) {
    formsButton.addEventListener('click', function () {
        darkBackground.classList.remove('hidden');
    });
}

if (cancelButton) {
    cancelButton.addEventListener('click', function () {
        darkBackground.classList.toggle('hidden');
    });
}