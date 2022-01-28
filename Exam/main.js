'use strict';

////////////////////////////
////Серверный xhr запрос////
////////////////////////////

function downloadData(page = 1) {
    let url = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=4f587354-f61f-4f48-bd35-80a1f1b0706a";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderOkrugList(this.response);
        renderRaionList(this.response);
        renderTypeList(this.response);
    }
    xhr.send();
}

///////////////////////////////////////////////////////////////////////
////Создание dropdown списков для select'ов с серверными значениями////
///////////////////////////////////////////////////////////////////////

function renderOkrugList(records) {
    let okrugList = document.getElementById("SelectAdmArea");
    let arrOkrug = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrOkrug.length; i++) {
            if (record.admArea != arrOkrug[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            okrugList.append(createListItemOkrug(record));
            flag = 0;
            arrOkrug.push(record.admArea);
        }
    }
}

function createListItemOkrug(record) {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = record.admArea;
    return itemElement;
}

function renderRaionList(records) {
    let raionList = document.getElementById("SelectDistrict");
    let arrRaion = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrRaion.length; i++) {
            if (record.district != arrRaion[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            raionList.append(createListItemRaion(record));
            flag = 0;
            arrRaion.push(record.district);
        }
    }
}

function createListItemRaion(record) {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = record.district;
    return itemElement;
}

function renderTypeList(records) {
    let typeList = document.getElementById("SelectType");
    let arrType = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrType.length; i++) {
            if (record.typeObject != arrType[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            typeList.append(createListItemType(record));
            flag = 0;
            arrType.push(record.typeObject);
        }
    }
}

function createListItemType(record) {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = record.typeObject;
    return itemElement;
}

function renderTable(data) {
    let table = document.getElementById('table-row');
    let i = 0;
    for (let data_item of data) {
        if (i == 10) break
        else {
            table.append(createTableItemElement(data_item));
            i++;
        }
    }
    renderPaginationBtn(data)
}
/////////////////////////////////////////////////////////////////
////Получение заведений с сервера и их сортировка по рейтингу////
/////////////////////////////////////////////////////////////////

async function ServerRequest(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => alert(error.status));
}

async function downloadForm(url) {
    let jsonData = await ServerRequest(url);
    return jsonData;
}

function sort(jsonData) {
    let data = jsonData.sort(function (a, b) {
        return b.rate - a.rate;
    });
    console.log(jsonData);
    return data;
}

//////////////////////////////////
//Формирование таблицы заведений//
//////////////////////////////////


function createTableItemElement(data_item) {
    let itemElement = document.createElement('tr');
    let idElement = data_item.id;
    itemElement.classList.add('align-middle', 'place-row');
    itemElement.setAttribute('place-id', idElement);
    itemElement.append(createRowName(data_item));
    itemElement.append(createRowType(data_item));
    itemElement.append(createRowAddress(data_item));
    itemElement.append(createRowButtonTd());
    return itemElement;
}

function createRowName(data_item) {
    let contentElementName = document.createElement('th');
    contentElementName.innerHTML = data_item.name;
    return contentElementName;
}

function createRowType(data_item) {
    let contentElementType = document.createElement('td');
    contentElementType.innerHTML = data_item.typeObject;
    return contentElementType;
}

function createRowAddress(data_item) {
    let contentElementAddress = document.createElement('td');
    contentElementAddress.innerHTML = data_item.address;
    return contentElementAddress;
}

function createRowButtonTd() {
    let itemElement = document.createElement('td');
    itemElement.append(createRowButton());
    return itemElement;
}

function createRowButton() {
    let contentElementButton = document.createElement('button');
    contentElementButton.innerHTML = "Выбрать";
    contentElementButton.classList.add('btn');
    contentElementButton.classList.add('btn-outline-secondary');
    return contentElementButton;
}

///////////////////////////////////
////Получение selected-значений////
///////////////////////////////////

function getSelect(data) {
    var arrayFilters = new Map();
    let selectedAdmArea = document.getElementById("SelectAdmArea").options.selectedIndex;
    let selectedAdmAreaText = document.getElementById("SelectAdmArea").options[selectedAdmArea].text;
    arrayFilters.set('admArea', selectedAdmAreaText);
    let selectedDistrict = document.getElementById("SelectDistrict").options.selectedIndex;
    let selectedDistrictText = document.getElementById("SelectDistrict").options[selectedDistrict].text;
    arrayFilters.set('district', selectedDistrictText);
    let selectedType = document.getElementById("SelectType").options.selectedIndex;
    let selectedTypeText = document.getElementById("SelectType").options[selectedType].text;
    arrayFilters.set('typeObject', selectedTypeText);
    let selectedBenefits = document.getElementById("SelectBenefits").options.selectedIndex;
    let selectedBenefitsText = document.getElementById("SelectBenefits").options[selectedBenefits].text;
    arrayFilters.set('socialPrivileges', selectedBenefitsText);
    renderTableSelect(data, arrayFilters);
}

///////////////////////////////////////////////////////////
///Формирование таблицы на основе проставленных фильтров///
///////////////////////////////////////////////////////////

function admAreaListForSelect(records) {
    let arrAdmArea = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrAdmArea.length; i++) {
            if (record.admArea != arrAdmArea[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            flag = 0;
            arrAdmArea.push(record.admArea);
        }
    }
    return arrAdmArea;
}

function districtListForSelect(records) {
    let arrDistrict = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrDistrict.length; i++) {
            if (record.district != arrDistrict[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            flag = 0;
            arrDistrict.push(record.district);
        }
    }
    return arrDistrict;
}

function typeListForSelect(records) {
    let arrType = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrType.length; i++) {
            if (record.typeObject != arrType[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            flag = 0;
            arrType.push(record.typeObject);
        }
    }
    return arrType;
}

function renderTableSelect(data, arrayFilters) {
    let table = document.getElementById('table-row');
    document.getElementById('_pagination').innerHTML = ' ';
    table.innerHTML = " ";
    let i = 0;
    let data_sort = [];
    console.log(arrayFilters);
    let arr_admArea = admAreaListForSelect(data);
    let arr_district = districtListForSelect(data);
    let arr_type = typeListForSelect(data);
    let arr_socPriv = ['true', 'false']
    if (arrayFilters.get("admArea") != "Не выбрано") arr_admArea = [arrayFilters.get("admArea")];
    if (arrayFilters.get("district") != "Не выбрано") arr_district = [arrayFilters.get("district")];
    if (arrayFilters.get("typeObject") != "Не выбрано") arr_type = [arrayFilters.get("typeObject")];
    if (arrayFilters.get("socialPrivileges") != "Не выбрано") arr_socPriv = [String(arrayFilters.get("socialPrivileges"))];
    for (let data_item of data) {
        if (arr_admArea.includes(data_item.admArea)
            && arr_district.includes(data_item.district)
            && arr_type.includes(data_item.typeObject)
            && arr_socPriv.includes(String(data_item.socialPrivileges))) {
            data_sort.push(data_item);
            i++;
        }
    }
    renderPaginationBtn(data_sort);
}

/////////////////////////////////////
//////Обновление списка районов//////
/////////////////////////////////////

document.getElementById('SelectAdmArea').onchange = function () {
    let url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=4f587354-f61f-4f48-bd35-80a1f1b0706a';
    let selectedAdmArea = document.getElementById("SelectAdmArea").options.selectedIndex;
    let selectedAdmAreaText = document.getElementById("SelectAdmArea").options[selectedAdmArea].text;
    if (selectedAdmAreaText != "Не выбрано") downloadForm(url)
        .then(downloadData => renderNewRaionList(downloadData, selectedAdmAreaText))
    else downloadForm(url)
        .then(downloadData => renderRaionList(downloadData))
}

function renderNewRaionList(records, selectedAdmAreaText) {
    let districtList = document.getElementById("SelectDistrict");
    districtList.innerHTML = "";
    districtList.append(EmptyRaionListItem());
    let arrDistrict = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrDistrict.length; i++) {
            if (record.district != arrDistrict[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true && selectedAdmAreaText == record.admArea) {
            districtList.append(createListItemRaion(record));
            flag = 0;
            arrDistrict.push(record.district);
        }
    }
}

function EmptyRaionListItem() {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = "Не выбрано";
    return itemElement;
}

/////////////////////////////////////
///////////////Пагинация/////////////
/////////////////////////////////////

function renderPaginationBtn(data) {
    const amountOfButtons = Math.ceil(data.length / 10)
    let arrayButtons = [];
    for (let i = 1; i <= amountOfButtons; i++) {
        let btn = document.createElement('button');
        btn.classList.add('btn', 'btn-outline-dark', 'm-2');
        btn.innerHTML = i;
        arrayButtons.push(btn);
    }
    renderFirstPagination(arrayButtons, data);
    setPagination(arrayButtons[0], arrayButtons, data);
    addEventOnPaginationButtons(arrayButtons, data);
}

function renderFirstPagination(arrayButtons, data) {
    let pagination = document.getElementById('_pagination');
    const amountOfButtons = Math.ceil(data.length / 10);
    if (amountOfButtons <= 5) {
        for (let i = 0; i < amountOfButtons; i++) {
            pagination.appendChild(arrayButtons[i]);
        }
    } else {
        for (let i = 0; i < 5; i++) {
            pagination.appendChild(arrayButtons[i]);
        }
        pagination.appendChild(arrayButtons[amountOfButtons - 1]);
    }
}

function createDotsForPagination() {
    let dots = document.createElement('p');
    dots.innerHTML = '. . .';
    dots.classList.add('fw-bold', 'mt-auto', 'mb-0', 'mx-2');
    return dots;
}

function widePagination(pageNumber, arrayButtons, data) {
    let pagination = document.getElementById('_pagination');
    const countBtn = 5;
    const strOnPage = 10;
    const amountOfButtons = Math.ceil(data.length / strOnPage);
    let dotsOnPagination1 = createDotsForPagination();
    let dotsOnPagination2 = createDotsForPagination();
    let dotsOnPagination3 = createDotsForPagination();
    let dotsOnPagination4 = createDotsForPagination();
    if (pageNumber <= countBtn - 1) {
        pagination.innerHTML = '';
        for (let i = 0; i < countBtn; i++) {
            pagination.appendChild(arrayButtons[i]);
        }
        pagination.appendChild(dotsOnPagination1);
        pagination.appendChild(arrayButtons[amountOfButtons - 1]);
    }
    else if (pageNumber >= amountOfButtons - (countBtn - 1) + 1) {
        pagination.innerHTML = '';
        pagination.appendChild(arrayButtons[0]);
        pagination.appendChild(dotsOnPagination2);
        for (let i = amountOfButtons - (countBtn - 1) - 1; i < amountOfButtons; i++) {
            pagination.appendChild(arrayButtons[i]);
        }
    }
    else {
        pagination.innerHTML = '';
        pagination.appendChild(arrayButtons[0]);
        pagination.appendChild(dotsOnPagination3);
        for (let i = -3; i <= 1; i++) {
            pagination.appendChild(arrayButtons[pageNumber + i]);
        }
        pagination.appendChild(dotsOnPagination4);
        pagination.appendChild(arrayButtons[amountOfButtons - 1]);
    }
}

function addEventOnPaginationButtons(arrayButtons, data) {
    for (let btn of arrayButtons) {
        btn.addEventListener('click', function () {
            setPagination(btn, arrayButtons, data)
        })
    }
}

let setPagination = (function () {
    let active;
    return function (btn, arrayButtons, data) {
        let table = document.getElementById('table-row');
        if (active) { active.classList.remove("active"); }
        active = btn;
        let pageNumber = +btn.innerHTML;
        btn.classList.add('active');
        if (arrayButtons.length > 5) { widePagination(pageNumber, arrayButtons, data); }
        let startElement = (pageNumber - 1) * 10;
        let endElement = startElement + 10;
        let notes = data.slice(startElement, endElement);
        table.innerHTML = ' ';
        for (let note of notes) {
            table.append(createTableItemElement(note));
        }
        takeIdOfPlace();
    };
}());

/////////////////////////////////////////////////////////
//////Запрос к серверу по нажатию на кнопку "Найти"//////
/////////////////////////////////////////////////////////

function clickHandlerSearchBtn() {
    let url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=4f587354-f61f-4f48-bd35-80a1f1b0706a';
    downloadForm(url)
        .then(downloadData => sort(downloadData))
        .then(data => getSelect(data));;
}

/////////////////////////////////////////////////////////////
//////Запрос к серверу для получение данных о заведении//////
/////////////////////////////////////////////////////////////

async function downloadPlaceById(id) {
    let url = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants/" + id + "?api_key=4f587354-f61f-4f48-bd35-80a1f1b0706a";
    let jsonData = await ServerRequest(url);
    setSocialDiscountCheckbox(jsonData);
    return jsonData;
}

function setSocialDiscountCheckbox(jsonData) {
    if (jsonData.socialPrivileges == true) {
        document.getElementById('Discount').setAttribute('checked', 'true');
        document.getElementById('Discount').removeAttribute('disabled');
    }
    else {
        document.getElementById('Discount').setAttribute('disabled', 'true');
        document.getElementById('Discount').removeAttribute('checked');
    }
}

///////////////////////////////////////////////////////////
//////Обработчик кнопки "Выбрать" в таблице заведения//////
///////////////////////////////////////////////////////////

function clickHandlerChoiceBtn(event) {
    let placeRow = event.target.closest('.place-row');
    let rowId = placeRow.getAttribute('place-id');
    downloadPlaceById(rowId)
        .then(menuItem => takePricesById(menuItem))
        .then(arrayPrices => takeJsonInfo(arrayPrices));
}

////////////////////////////////////////////////////////////
//////Проставление функций кликов для кнопок "Выбрать"//////
////////////////////////////////////////////////////////////

function takeIdOfPlace() {
    for (let btn of document.querySelectorAll('.place-row')) {
        btn.onclick = clickHandlerChoiceBtn;
    }
}

////////////////////////////////////////
//////Получение цен сетов для меню//////
////////////////////////////////////////

function takePricesById(data) {
    let arrayPrices = [];
    arrayPrices.push(data.set_1);
    arrayPrices.push(data.set_2);
    arrayPrices.push(data.set_3);
    arrayPrices.push(data.set_4);
    arrayPrices.push(data.set_5);
    arrayPrices.push(data.set_6);
    arrayPrices.push(data.set_7);
    arrayPrices.push(data.set_8);
    arrayPrices.push(data.set_9);
    arrayPrices.push(data.set_10);
    return arrayPrices;
}

/////////////////////////////
//////Создание карточек//////
/////////////////////////////

function takeJsonInfo(arrayPrices) {
    let url = './menu.json';
    downloadForm(url)
        .then(menuData => renderMenu(arrayPrices, menuData));
}

function renderMenu(arrayPrices, menuData) {
    document.querySelector('.menu-section').classList.remove('d-none');
    let menuWindow = document.getElementById('menu');
    menuWindow.innerHTML = '';
    let k = 0;
    for (let data of menuData) {
        let cardMenu = document.querySelector('.template-card').cloneNode(true);
        cardMenu.classList.remove('d-none');
        cardMenu.querySelector('.card-img-top').setAttribute('src', data.menuImage)
        cardMenu.querySelector('.card-title').innerHTML = data.menuName;
        cardMenu.querySelector('.card-text').innerHTML = data.menuDesc;
        cardMenu.querySelector('.card-cost').innerHTML = arrayPrices[k];
        k++;
        menuWindow.appendChild(cardMenu);
    }
    plusCost();
    minusCost();
}

/////////////////////////////////////////////////////////////
//////Обработчики для кнопок увеличения/уменьшения меню//////
/////////////////////////////////////////////////////////////

function plusCost() {
    for (let btn of document.querySelectorAll('.btn-plus')) {
        btn.onclick = clickHandlerPlusCostBtn;
    }
}

function minusCost() {
    for (let btn of document.querySelectorAll('.btn-minus')) {
        btn.onclick = clickHandlerMinusCostBtn;
    }
}

///////////////////////////////////////////////////////
//////Функции увеличения/уменьшения итоговой цены//////
///////////////////////////////////////////////////////

function clickHandlerPlusCostBtn(event) {
    document.querySelector('.btn-order').removeAttribute('disabled');
    event.target.parentNode.querySelector('.input').stepUp();
    let closestCard = event.target.closest('.card-body');
    let costMenu = closestCard.querySelector('.card-cost').innerHTML;
    document.getElementById('final-cost').innerHTML = +document.getElementById('final-cost').innerHTML + +costMenu;
}

function clickHandlerMinusCostBtn(event) {
    if (event.target.parentNode.querySelector('.input').value != 0) {
        event.target.parentNode.querySelector('.input').stepDown();
        let closestCard = event.target.closest('.card-body');
        let costMenu = closestCard.querySelector('.card-cost').innerHTML;
        document.getElementById('final-cost').innerHTML = +document.getElementById('final-cost').innerHTML - +costMenu;
    }
    if (document.getElementById('final-cost').innerHTML == 0) {
        document.querySelector('.btn-order').setAttribute('disabled', 'true');
    }
}

//////////////////////
//////Обработчик//////
//////////////////////

window.onload = function () {
    let url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=4f587354-f61f-4f48-bd35-80a1f1b0706a';
    downloadData();
    downloadForm(url)
        .then(downloadData => sort(downloadData))
        .then(data => renderTable(data))
        .then(() => takeIdOfPlace());
    let searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', clickHandlerSearchBtn);
}