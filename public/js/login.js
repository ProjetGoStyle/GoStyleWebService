const alert = document.querySelector('#error');
document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

const displayError = (errormessage) => {
     console.log(errormessage);
     alert.innerHTML = `<div class="alert alert-danger alert-dismissible" id="error" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="close">&times;</button>${errormessage}
    </div>`;
};
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const loginForm = document.querySelector('#loginForm');
loginForm.onsubmit = (event) => {
     event.preventDefault();
     fetch('/login', {
          method: 'POST',
          mode: 'cors',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify({
               login: loginInput.value,
               password: passwordInput.value
          }),

     }).then(async (response) => {
          const json = await response.json();
          alert.innerHTML = '';
          const date = new Date();
          date.setTime(date.getTime() + (300000));
          document.cookie = `token=${json.token};expires=${date.toUTCString()};`;
          window.location.replace('/promocodes');

     }).catch((error) => {
          displayError('Login/ Mot de passe incorrect');
     });
};