const errorDiv = document.querySelector('#error');
window.sessionStorage.clear();
const displayError = (errormessage) => {
    errorDiv.innerHTML = `<div class="alert alert-danger alert-dismissible" id="error" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    &times;
                                </button>${errormessage}
                            </div>`
};
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const loginForm = document.querySelector('#loginForm');
loginForm.onsubmit = (event) => {
    event.preventDefault();
    fetch('/login', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            login: loginInput.value,
            password: passwordInput.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (response) => {
        const json = await response.json();
        window.sessionStorage.setItem('token', json.token);
        window.location.replace('/promocodes');
    }).catch((error) => {
        displayError('Login/ Mot de passe incorrect');
    });
};