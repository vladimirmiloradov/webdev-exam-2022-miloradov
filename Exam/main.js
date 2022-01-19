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

/////////////////////////////////////////////////////////////////
////Получение заведений с сервера и их сортировка по рейтингу////
/////////////////////////////////////////////////////////////////

async function ServerRequest(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => alert(error.status));
}

async function downloadForm() {
    let url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=4f587354-f61f-4f48-bd35-80a1f1b0706a';
    let jsonData = await ServerRequest(url);
    return jsonData;
}

function sort(jsonData) {
    let data = jsonData.sort(function (a, b) {
        return b.rate - a.rate;
    });
    return data;
}

///////////////////////////////////
////////Обработчики событий////////
///////////////////////////////////

window.onload = function () {
    downloadData();
    downloadForm()
        .then(downloadData => sort(downloadData))
        .then(data => renderTable(data));
    let searchbtn = document.querySelector('.search-btn');
    searchbtn.addEventListener('click', clickHandler);
}

//////////////////////////////////
//Формирование таблицы заведений//
//////////////////////////////////

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
}

function createTableItemElement(data_item) {
    let itemElement = document.createElement('tr');
    itemElement.classList.add('align-middle');
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
    if (selectedAdmAreaText != "Не выбрано") arrayFilters.set('admArea', selectedAdmAreaText);
    let selectedDistrict = document.getElementById("SelectDistrict").options.selectedIndex;
    let selectedDistrictText = document.getElementById("SelectDistrict").options[selectedDistrict].text;
    if (selectedDistrictText != "Не выбрано") arrayFilters.set('district', selectedDistrictText);
    let selectedType = document.getElementById("SelectType").options.selectedIndex;
    let selectedTypeText = document.getElementById("SelectType").options[selectedType].text;
    if (selectedTypeText != "Не выбрано") arrayFilters.set('typeObject', selectedTypeText);
    let selectedBenefits = document.getElementById("SelectBenefits").options.selectedIndex;
    let selectedBenefitsText = document.getElementById("SelectBenefits").options[selectedBenefits].text;
    if (selectedBenefitsText != "Не выбрано") arrayFilters.set('socialPrivileges', selectedBenefitsText);
    renderTableSelect(data, arrayFilters);
}

///////////////////////////////////////////////////////////
///Формирование таблицы на основе проставленных фильтров///
///////////////////////////////////////////////////////////

function renderTableSelect(data, arrayFilters) {
    let table = document.getElementById('table-row');
    table.innerHTML = " ";
    let i = 0;

    for (let data_item of data) {
        if (i == 10) break
        else {
            if (data_item.admArea == selectedAdmAreaText
                && data_item.district == selectedDistrictText
                && data_item.typeObject == selectedTypeText
                && String(data_item.socialPrivileges) === String(selectedBenefitsText)) {
                table.append(createTableItemElement(data_item));
                i++;
            }
        }
    }
}

/////////////////////////////////////
//////Нажатие на кнопку "Найти"//////
/////////////////////////////////////

function clickHandler(event) {
    downloadForm()
        .then(downloadData => sort(downloadData))
        .then(data => getSelect(data));;
}

/////////////////////////////////////
//////Обновление списка районов//////
/////////////////////////////////////

document.getElementById('SelectAdmArea').onchange = function () {
    let selectedAdmArea = document.getElementById("SelectAdmArea").options.selectedIndex;
    let selectedAdmAreaText = document.getElementById("SelectAdmArea").options[selectedAdmArea].text;
    if (selectedAdmAreaText != "Не выбрано") downloadForm()
        .then(downloadData => renderNewRaionList(downloadData, selectedAdmAreaText))
    else downloadForm()
        .then(downloadData => renderRaionList(downloadData))
}

function renderNewRaionList(records, selectedAdmAreaText) {
    let raionList = document.getElementById("SelectDistrict");
    raionList.innerHTML = "";
    raionList.append(EmptyRaionListItem());
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
        if (flag == true && selectedAdmAreaText == record.admArea) {
            raionList.append(createListItemRaion(record));
            flag = 0;
            arrRaion.push(record.district);
        }
    }
}

function EmptyRaionListItem() {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = "Не выбрано";
    return itemElement;
}
