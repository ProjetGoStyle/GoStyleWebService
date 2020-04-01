const alert = document.querySelector('#error');
window.sessionStorage.clear();

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
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            login: loginInput.value,
            password: passwordInput.value
        }),

    }).then(async (response) => {
        const json = await response.json();
        alert.innerHTML = '';
        window.sessionStorage.setItem('token', json.token);
        window.location.replace('/promocode.html');
    }).catch((error) => {
        displayError('Login/ Mot de passe incorrect');
    });
};