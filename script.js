//input tags
const designation = document.getElementById("designation");
const uname = document.getElementById("name");
const pno = document.getElementById("pno");
const address = document.getElementById("address");
const pinno = document.getElementById("pinno");
const email = document.getElementById("email");
const fileImage = document.getElementById('user-image');
const company = document.getElementById("company");
const country = document.getElementById("country");
const state = document.getElementById("state");
let imgTag = document.getElementById("showImg");

//select tags
const p = document.getElementsByTagName("p");
const table = document.getElementById("tableTag")
let reset = document.getElementById("resetbtn");
let registerBtn = document.getElementById("register");
let noTable = document.getElementById("no-table-found");

//regex patterns
const regexName = /^[a-zA-Z]{2,}$/;
const regexPin = /^[0-9]{6}$/;
const regexPno = /^[0-9]{10}$/;
const regexEmail = /^([a-zA-Z0-9._]{1,})+@([a-zA-Z]{1,})\.([a-z]{2,})$/;

let imgurl; //set image to image tag
let editId = null; // For editing

//Getting api data
let datas = [];
const getApi = async () => {
    try {
        const response = await fetch(" https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json")
        datas = await response.json();
        for (let i of datas) {
            let option = document.createElement("option");
            option.value = i.id;
            option.innerText = i.name;
            country.appendChild(option);
        }
        country.addEventListener("change", () => {
            const selecteditem = country.value;
            const selecteditemId = datas.find((item) => item.id == selecteditem)
            if (selecteditemId) {
                state.innerText = "";
                selecteditemId.states?.forEach(i => {
                    let option = document.createElement("option");
                    option.value = i.id;
                    option.innerText = i.name;
                    state.appendChild(option)
                })
            }
        })
    } catch (e) {
        console.error(e);
    }
}

let arr = [designation, address, pinno, email, pno, uname, company, country, state];

// ----------addeventlistener-----------------
let arr2 = [uname, company, designation, country, state, email, address];

function addEventListenerValue() {
    const arr3 = arr2.filter((i) => i.value === "");
    for (let i of arr3) {
        i.addEventListener("input", function () {
            i.nextElementSibling.style.visibility = (i.value == "") ? "visible" : "hidden";
        })
    }
    country.addEventListener("change", function () {
        state.nextElementSibling.style.visibility = "hidden";
    })
    email.addEventListener("input", function () {

        email.nextElementSibling.style.visibility = (!regexEmail.test(email.value) || email.value == "") ? "visible" : "hidden";
    })
    pno.addEventListener("input", function () {
        pno.value = pno.value.replace(/\D/g, '');
        pno.nextElementSibling.style.visibility = (!regexPno.test(pno.value) || pno.value == "") ? "visible" : "hidden";
    })
    pinno.addEventListener("input", function () {
        pinno.value = pinno.value.replace(/\D/g, '');
        pinno.nextElementSibling.style.visibility = (!regexPin.test(pinno.value) || pinno.value == "") ? "visible" : "hidden";
    })
}
addEventListenerValue();
//-------------------end---------------------------

document.getElementById("register").addEventListener("click", validateData);

function validateData() {
    showError();
    let boolArray = [];
    for (let i of p) {
        (i.style.visibility === "hidden") ? boolArray.push(true) : boolArray.push(false);
    }
    const isCheck = boolArray.every((n) => n === true);
    if (isCheck) {
        noTable.style.display = "none";
        setDatas();
    }
}

//check inputs condition
function showError() {
    for (let i of arr) {
        i.nextElementSibling.style.visibility = (i.value == "") ? "visible" : "hidden";
    }

    fileImage.nextElementSibling.style.visibility = (imgTag.alt == "dummy") ? "visible" : "hidden";

    uname.nextElementSibling.style.visibility = (!regexName.test(uname.value) || uname.value == "") ? "visible" : "hidden";

    pinno.nextElementSibling.style.visibility = (!regexPin.test(pinno.value) || pinno.value == "") ? "visible" : "hidden";

    pno.nextElementSibling.style.visibility = (!regexPno.test(pno.value) || pno.value == "") ? "visible" : "hidden";

    email.nextElementSibling.style.visibility = (!regexEmail.test(email.value) || email.value == "") ? "visible" : "hidden";
} 

let imgName;
fileImage.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imgurl = e.target.result; // Base64 encoded string
            imgName = file.name;
            imgTag.src = imgurl;
            imgTag.alt = "image";
        };
        fileImage.nextElementSibling.style.visibility = "hidden";
        reader.readAsDataURL(file);
    }
});

let arrData = []; // for edit
function setDatas() {
    let obj = {
        id: editId ? editId : Date.now() % 100,
        image2: imgurl,
        uname2: uname.value,
        company2: company.value,
        pno2: pno.value,
        fileImage2: fileImage,
        country2: country.value,
        designation2: designation.value,
        address2: address.value,
        email2: email.value,
        state2: state.value,
        pinno2: pinno.value
    };

    if (editId) {
        // Update existing record
        const index = arrData.findIndex(item => item.id === editId);
        arrData[index] = obj;
        // Update row in DOM
        const existingRow = document.querySelector(`tr[data-id='${editId}']`);
        if (existingRow) {
            existingRow.innerHTML = `
                <td><img class="displayImg" src="${obj.image2}" alt='image'></td>
                <td>${obj.uname2}</td>
                <td>${obj.designation2}</td>
                <td>${obj.company2}</td>
                <td>${obj.pno2}</td>
                <td>${obj.email2}</td>
                <td>
                    <button class='editBtn'>🖊</button>
                    <button class='delBtn'>❌</button>
                </td>
            `;
            existingRow.querySelector(".editBtn").addEventListener("click", () => editData(obj.id));
            existingRow.querySelector(".delBtn").addEventListener("click", () => deleteData(obj.id));
        }
    } else {
        arrData.push(obj); // else add new data
        renderTableRow(obj);
    }
    editId = null;
    localStorage.setItem('Data', JSON.stringify(arrData));
    resetAll();
}
// --------------------------------------------------------

function renderTableRow(obj) {
    let tr = document.createElement("tr");
    tr.setAttribute("data-id", obj.id); //For identify row
    let td = [];
    td[0] = document.createElement("td");
    td[0].innerHTML = `<img class="displayImg" src="${obj.image2}" alt='image'>`;
    tr.appendChild(td[0]);
    const tableArray = [obj.uname2, obj.designation2, obj.company2, obj.pno2, obj.email2];
    for (let i = 1; i <= 5; i++) {
        td[i] = document.createElement("td");
        td[i].textContent = tableArray[i - 1];
        tr.appendChild(td[i]);
    }
    td[6] = document.createElement("td");
    td[6].innerHTML = `
        <button class='editBtn'>🖊</button>
        <button class='delBtn' id='delBtn'>✖</button>
        `;
    tr.appendChild(td[6]);
    table.appendChild(tr);
    table.style.visibility = "visible";
    //Add Event listeners for buttons
    td[6].querySelector('.editBtn').addEventListener('click', () => editData(obj.id));
    td[6].querySelector('.delBtn').addEventListener('click', () => deleteData(obj.id));
}

function editData(id) {
    resetAll();
    registerBtn.innerText = "Update";
    reset.disabled = true;
    document.querySelectorAll(".delBtn").forEach(i => i.disabled = true)
    const receivedData = arrData.find((i) => i.id === id);
    if (!receivedData) return;
    uname.value = receivedData.uname2;
    company.value = receivedData.company2;
    country.value = receivedData.country2;
    email.value = receivedData.email2;
    address.value = receivedData.address2;
    designation.value = receivedData.designation2;
    pinno.value = receivedData.pinno2;
    pno.value = receivedData.pno2;
    imgTag.alt = receivedData.fileImage2;
    // fileImage.name = receivedData.fileImage2;

    state.innerHTML = '';
    const selecteditemId = datas.find((i) => i.id == receivedData.country2);
    if (selecteditemId) {
        selecteditemId.states.forEach(i => {
            let option = document.createElement("option");
            option.innerText = i.name;
            option.value = i.id;
            state.appendChild(option);
        });
    }
    state.value = receivedData.state2;
    // For image
    imgurl = receivedData.image2;
    imgTag.src = imgurl;
    editId = id;
}

// Delete function
function deleteData(id) {
    resetAll();
    arrData = arrData.filter(item => item.id !== id);
    localStorage.setItem('Data', JSON.stringify(arrData));
    const rowToDelete = document.querySelector(`tr[data-id='${id}']`);
    if (rowToDelete) {
        rowToDelete.remove();
    }
    if (arrData.length === 0) {
        table.style.visibility = "hidden";
        noTable.style.display = "block";
    }
}

//reset function
function resetAll() {
    uname.value = "";
    company.value = "";
    country.value = "";
    state.innerHTML = "<option value ='' selected disabled>Select State </option>";
    email.value = "";
    address.value = "";
    designation.value = "";
    pinno.value = "";
    pno.value = "";
    imgTag.src = "dummy.jpg";
    imgTag.alt = "dummy";
    for (let i of p) {
        i.style.visibility = "hidden";
    }
    registerBtn.textContent = "Register"
    reset.disabled = false;
    document.querySelectorAll(".delBtn").forEach((i) => i.disabled = false);
    editId = null; // clear editing state
}

function storeData() {
    if (!localStorage.getItem('Data')) {
        arrData = [];
        noTable.style.display = "block";
    } else {
        arrData = JSON.parse(localStorage.getItem('Data'));
        arrData.forEach(item => {
            renderTableRow(item);
        });
        noTable.style.display = "none";
    }
}
reset.addEventListener("click", resetAll);
getApi();
document.addEventListener("DOMContentLoaded", storeData);