const promoCodeTable = document.querySelector('#promoCodes');
const promoCodeInput = document.querySelector('#promoCodeInput');
const descriptionInput = document.querySelector('#descriptionInput');

const avgUseCurrentWeek = document.querySelector('#avgUseCurrentWeek');
const avgUsePreviousWeek = document.querySelector('#avgUsePreviousWeek');
const numberOfUseByCodePromo = document.querySelector('#numberOfUseByCodePromo');

const addForm = document.querySelector('#addForm');

function createTableElementForCodePromo(id, promoCode, description) {
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


fetch('/api/coupons', {
     method: 'GET',
     mode: cors,
     headers: header
}).then(async (response) => {
     const promoCodes = await response.json();
     for (const code of promoCodes)
          promoCodeTable.appendChild(createTableElementForCodePromo(code.id, code.code, code.description));
}).catch(catchFunction);

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
               promoCodeTable.appendChild(createTableElementForCodePromo(codepromo.id, codepromo.code, codepromo.description));
     }).catch(catchFunction);
};

fetch('/api/statistiques', {
    method: 'GET',
    mode: cors,
    headers: header,
}).then(async(response) => {
    const statistics = await response.json();
    avgUseCurrentWeek.innerHTML += statistics.avgCurrentWeek
    avgUsePreviousWeek.innerHTML += statistics.avgPreviousWeek
    /*for(const nbOfUseForOneCodePromo of statistics.numberOfUseByCodePromo){
        const li = document.createElement('li');
        li.innerHTML = `Code promotionnel: ${nbOfUseForOneCodePromo.code} - Utilisations: ${nbOfUseForOneCodePromo.countUse} `;
        numberOfUseByCodePromo.appendChild(li);
    }*/

}).catch(catchFunction);

