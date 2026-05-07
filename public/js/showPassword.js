// function togglePasswordType() {
  
const passwordInputs = Array.from(document.querySelectorAll("input[type='password']"));
const showPasswordCheckbox = document.querySelectorAll(".showPassword");
// passwordInputs.forEach(e => {
//   if (e.id===) {

//   }
// });

showPasswordCheckbox.forEach((checkbox) => {
  checkbox.addEventListener('change', ()=>{
    const gInput = passwordInputs.find((input) => input.id === checkbox.value);
    if (gInput) {
      if (checkbox.checked) {
        gInput.type = 'text';
      } else {
        gInput.type = 'password';
      }
    }
  });
});

//   if (passwordInput.type === 'password') {
//     passwordInput.type = 'text';
//     showPasswordCheckbox.checked = true;
//     showPasswordCheckbox.classList.remove('bx-show');
//     showPasswordCheckbox.classList.add('bx-hide')
//     console.log('Password shown as text');
//   } else {
//     passwordInput.type = 'password';
//     showPasswordCheckbox.checked = false;
//     showPasswordCheckbox.classList.remove('bx-hide');
//     showPasswordCheckbox.classList.add('bx-show');
//     console.log('Password hidden');
//   }
// }
