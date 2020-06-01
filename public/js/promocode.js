const promoCodeTable = document.querySelector('#promoCodes');
const promoCodeInput = document.querySelector('#promoCodeInput');
const descriptionInput = document.querySelector('#descriptionInput');

const promoCodeInputUpdate = document.querySelector('#promoCodeInputUpdate');
const descriptionInputUpdate = document.querySelector('#descriptionInputUpdate');
const codepromoIdUpdate = document.querySelector("#codepromoIdUpdate");

const avgUseCurrentWeek = document.querySelector('#avgUseCurrentWeek');
const avgUsePreviousWeek = document.querySelector('#avgUsePreviousWeek');
const numberOfUseByCodePromo = document.querySelector('#numberOfUseByCodePromo');

const addCodePromo = document.querySelector('#addCodePromo');
addCodePromo.onsubmit = (event) => {
    event.preventDefault();
    const codeObject = {
        code: escapeHtml(promoCodeInputUpdate.value),
        description: escapeHtml(descriptionInputUpdate.value)
    };

    fetch('/api/coupon', {
        method: 'POST',
        mode: cors,
        headers: header,
        body: JSON.stringify(codeObject)
    }).then(async (response) => {
        const codepromo = await response.json();
        if (response.status === 500)
            displayError(codepromo.erreur);
        else
            promoCodeTable.appendChild(createTableElementForCodePromo(codepromo.id, codepromo.code, codepromo.description));
    }).catch(catchFunction);
};

const updateCodePromo = document.querySelector('#updateCodePromo');
updateCodePromo.onsubmit = (event) => {
    event.preventDefault();
    const codeObject = {
        code: escapeHtml(promoCodeInputUpdate.value),
        description: escapeHtml(descriptionInputUpdate.value)
    };

    fetch('/api/coupon/'+codepromoIdUpdate.value, {
        method: 'PUT',
        mode: cors,
        headers: header,
        body: JSON.stringify(codeObject)
    }).then(async (response) => {
        location.reload();
    }).catch(catchFunction);
};


const createTableElementForCodePromo = (id, promoCode, description) => {
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
    tr.onclick = () => {
        promoCodeInputUpdate.disabled = false;
        descriptionInputUpdate.disabled = false;

        promoCodeInputUpdate.value = promoCode;
        descriptionInputUpdate.value = description;
        codepromoIdUpdate.value = id;
    }
    tr.appendChild(deleteElement);

    return tr;
}

const getDatas = async () => {
    try{
        const response = await fetch('/api/coupons', {
            method: 'GET',
            mode: cors,
            headers: header
        });
        const promoCodes = await response.json();
        for (const code of promoCodes)
            promoCodeTable.appendChild(createTableElementForCodePromo(code.id, code.code, code.description));
    }catch (err) {
        catchFunction(err);
    }

    try{
        const response = await fetch('/api/statistiques', {
            method: 'GET',
            mode: cors,
            headers: header,
        });
        const statistics = await response.json();
        avgUseCurrentWeek.innerHTML += statistics.avgCurrentWeek
        avgUsePreviousWeek.innerHTML += statistics.avgPreviousWeek
        for(const nbOfUseForOneCodePromo of statistics.numberOfUseByCodePromo) {
            const li = document.createElement('li');
            li.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center");
            li.innerHTML = `Code promotionnel: ${nbOfUseForOneCodePromo.code}`;

            const span = document.createElement('span');
            span.setAttribute("class", "badge badge-primary badge-pill");
            span.innerHTML = nbOfUseForOneCodePromo.countUse;

            li.appendChild(span);
            numberOfUseByCodePromo.appendChild(li);
        }

    }catch (err) {
        catchFunction(err);
    }
}

getDatas().then();




