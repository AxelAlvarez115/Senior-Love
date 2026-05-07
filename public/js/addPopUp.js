const openForm = document.querySelector('.buttonform');
const cancelButton = document.querySelector('.forms__cancel');

const darkBackground = document.querySelector('.darkBackground');

openForm.addEventListener('click', function() {
    darkBackground.classList.remove('hidden');
});

cancelButton.addEventListener('click', function() {
    darkBackground.classList.add('hidden');
});