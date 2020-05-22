
const header = {
     'Content-Type': 'application/json',
};
const cors = 'cors';

const errorDiv = document.querySelector('#error');
const displayError = (errormessage) => {
     errorDiv.innerHTML = `<div class="alert alert-danger alert-dismissible" id="error" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    &times;
                                </button>${errormessage}
                            </div>`
};
const catchFunction = (error) => {
     console.table(error);
     displayError(error.erreur);
};
function createTableElement(id, promoCode, description) {
     const tr = document.createElement('tr');
     const rowNumber = document.createElement('th');
     rowNumber.setAttribute('scope', 'row');
     rowNumber.innerText = id;

     tr.appendChild(rowNumber);

     const codeElement = document.createElement('td');
     codeElement.innerText = promoCode;

     tr.appendChild(codeElement);

     const descElement = document.createElement('td');
     descElement.innerText = description;

     tr.appendChild(descElement);

     const deleteElement = document.createElement('td');

     const deleteButton = document.createElement('button');
     deleteButton.value = 'x';
     deleteButton.onclick = () => {

          fetch(`/api/coupon/${id}`, {
               method: 'DELETE',
               mode: cors,
               headers: header
          }).then((response) => {
               tr.parentNode.removeChild(tr);
          }).catch(catchFunction)
     };

     deleteElement.appendChild(deleteButton);

     tr.appendChild(deleteElement);

     return tr;
}

const promoCodeTable = document.querySelector('#promoCodes');

fetch('/api/coupons', {
     method: 'GET',
     mode: cors,
     headers: header
}).then(async (response) => {
     const promoCodes = await response.json();
     for (const code of promoCodes)
          promoCodeTable.appendChild(createTableElement(code.id, code.code, code.description));
}).catch(catchFunction);


const promoCodeInput = document.querySelector('#promoCodeInput');
const descriptionInput = document.querySelector('#descriptionInput');
const addForm = document.querySelector('#addForm');
addForm.onsubmit = (event) => {
     event.preventDefault();
     fetch('/api/coupon', {
          method: 'POST',
          mode: cors,
          headers: header,
          body: JSON.stringify({
               code: promoCodeInput.value,
               description: descriptionInput.value
          })
     }).then(async (response) => {
          const codepromo = await response.json();
          if (response.status === 500)
               displayError(codepromo.erreur);
          else
               promoCodeTable.appendChild(createTableElement(codepromo.id, codepromo.code, codepromo.description));
     }).catch(catchFunction);
};

const logoutButton = document.querySelector('#logout');
logoutButton.onclick = () => {
     fetch('/logout', {
          method: 'GET',
          mode: cors,
          headers: header
     }).then((response) => {
          window.location.replace('/');
     }).catch(catchFunction);
};
