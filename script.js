let entU = document.querySelector('#usersNum')
let btnCount = document.querySelector('#enterUsers')
let numOfUsers
let btnCheck = document.querySelector('.btn-check')
let table = document.querySelector('.maintable')
let info = document.querySelector('.info')

btnCount.onclick = () => {
    clearOut()
    numOfUsers = entU.value
    btnCheck.innerHTML = ''
    table.innerHTML = ''
    info.innerHTML = `Запросили юзеров = ${entU.value}`
    console.log(entU.value)
    if (entU.value > 0){
        entU.value = ''
        fetch(`https://randomuser.me/api/?results=${numOfUsers}`)
            .then(
                async response => {
                    await someFunc(response.json())
                },
                error => alert(`Rejected: ${error}`)
            );
    } else {
        alert('введите число больше нуля')
        entU.value = ''
    }
};

async function someFunc(data) {
    //массив клиентов
    let arrAllUsers = await data
    arrAllUsers = arrAllUsers.results
    console.log('arrAllUsers = ',arrAllUsers)
    console.log('Первый юзер ===', arrAllUsers[0])
    //массив для заголока таблицы и потом по этиму массиву будем выбирать данные по юзеру
    let nameButtons = getNameOfHeaders(arrAllUsers[0]) //название кнопок
    let headerTabl = [] //заголовки для таблицы
    //адд кнопки на страницу
    addButton(nameButtons)
    //тут  функция которая добавит в массив названия заголовка при нажатии на кнопку
    addHeader(headerTabl, arrAllUsers)
    ////получаем данные на юзера из таблицы
    getDateFromUserInTab(headerTabl)
}

//получаем названия для кнопок
function getNameOfHeaders(userFirst){
    let nameButtons = []
    for (let key in userFirst){
        nameButtons.push(key)
    }
    return nameButtons
}

//добавляем кнопки на страницу
// функция парсим массив одного юзера и добавялем кнопки на страницу
function addButton(data) {
    data.forEach( item =>{
        if (item === 'phone'){
            return false
        }
        if (item === 'registered'){
            return false
        }
        else {
            btnCheck.innerHTML += `<button class="btnAll">${item}</button>`
        }
    });
}

// при нажатии на кнопки
//берем с кнопок названия и формируем массив для заголовка таблицы
// и сразу запускаем строить таблицу - функц  newTab(headerTabl, arrAllUsers)
//
function addHeader(headerTabl, arrAllUsers) {
    //получаем все кнопки на странице
    let btnH = document.querySelectorAll('.btnAll')
    //сюда складываются заголовки таблицы и можно потом юзать для выборки инфы по юзерам
    //адд кнопкам функции при нажажатии на нее
    btnH.forEach( item =>{
        item.onclick = () =>{
            clearOut()
            item.style.backgroundColor = 'green'
            if (headerTabl.includes(item.textContent)){
                let index = headerTabl.indexOf(item.textContent);
                if(index !== -1) headerTabl.splice( index, 1 );
                item.style.backgroundColor = ''
            }
            //берем название кнопки и адд в массив header - для заголовка таблицы
            else {
                headerTabl.push(item.textContent)
            }
        //втсавляем таблицу
        newTab(headerTabl, arrAllUsers)
        //создаем после обработки новый объект-юзер для вывода на старницу
        newDataUserForView(headerTabl)
        }
    });
}

//создаем таблицу
async function newTab(headerTable, arrAllUsers) {
    table.innerHTML = ''
    //создаем элемент  для шапки табл
    let elementTh = document.createElement("tr");
    elementTh.className = 'table-header' //адд класс
    table.append(elementTh) // вставляем в документ
    // проходим по массиву headerTable заголовки таблицы и вставляем шапку таблицы
    if (headerTable.length !==0){
        elementTh.innerHTML += `<th class="th-header">№</th>`
    } else {elementTh.innerHTML = '' }
    headerTable.forEach( item => {
        if (item === 'phone') return false;
        if (item === 'registered') return false;
        else {
            elementTh.innerHTML += `<th class="th-header">${item}</th>`
        }
    });
    // берем массив объектов юзеров - проходим по нему и по каждому юзеру берем свойство
    // из массива-заголовков и вставялем в таблицу каждого юзероа строкой с его свойствами
    //по порядку согласно массива заголовка ххх
    for (let i in arrAllUsers ){
        //создаем линию юзера
        let elementTr = document.createElement("tr");
        elementTr.className = `user${i}`; //присваиваем ему класс
        table.append(elementTr) // + его в таблицу
        if (headerTable.length !==0){
            elementTr.innerHTML += `<td>${Number(i)+1}</td>`
        } else {elementTh.innerHTML = '' }
        //проходим по массиву заголовка и выбираем согласно свойства из массива
        //такое же свойство юзера и + в таблицу это свойство юзера
        headerTable.forEach(item =>{
            if (item === 'dob'){
                elementTr.innerHTML += `<td>${arrAllUsers[i][item]['date']}</td>`
            }
            else if (item === 'id'){
                elementTr.innerHTML += `<td>${arrAllUsers[i][item]['name']}</td>`
            }
            else if (item === 'location'){
                elementTr.innerHTML += `<td>${arrAllUsers[i][item]['city'] + ' ' +arrAllUsers[i][item]['country'] + ' '
                + arrAllUsers[i][item]['state']}</td>`
            }
            else if (item === 'login'){
                elementTr.innerHTML += `<td>${arrAllUsers[i][item]['username']}</td>`
            }
            else if (item === 'name'){
                elementTr.innerHTML += `<td>${arrAllUsers[i][item]['first'] + ' ' + arrAllUsers[i][item]['last']}</td>`
            }
            else if (item === 'picture'){
                elementTr.innerHTML += `<td><img src="${arrAllUsers[i][item]['thumbnail']}" alt=""></td>`
            }
            else if (item === 'registered') return false
            else if (item === 'phone') return false
            else {
                elementTr.innerHTML += `<td>${arrAllUsers[i][item]}</td>`
            }
        })
    }
}

// out - куда будет вывод на странице
let out = document.querySelector('.out')
//юзер выбранный из таблицы
let userFromTab = {}
//получаем данные на юзера из таблицы
function getDateFromUserInTab(headerTabl) {
    document.querySelector('table').onclick = function (event) {
        clearOut() // очситка вывода
        userFromTab = {}
        // console.log('Заголовки = ', headerTabl)
        if (event.target.tagName !== 'TD') return false;
        // console.log(event.target);
        //получаем всех детей цели на которую нажали - делегирование
        let data = [...event.target.parentNode.children];
        // console.log(data)
        //получаем данные на юзера через функцию getDataFromTd
        let allDataSelectUser = getDataFromTd(data);
        console.log('Данные Юзера', allDataSelectUser)
        //получаем одного выбранного юзера в виде объекта
        let userFromTabObject = newDataUserForView(headerTabl, allDataSelectUser )
        //Вывод на старницу новой инфы
        viewOnPageDateSelectUser(userFromTabObject )
        //модальный вывод на старницу выбранного юзера
        insertInModal(userFromTabObject)
    }
}
//получаем юзера tdArr и берем из него данные согласно заголовка таблицы
function getDataFromTd(tdArr) {
    let allDataSelectUser = []
    for (let i=1; i<tdArr.length; i++){
        // console.log(tdArr[i].innerHTML)
        allDataSelectUser.push(tdArr[i].innerHTML)
    }
    return allDataSelectUser
}

//создаем после обработки новый объект-юзер для вывода на старницу
function newDataUserForView(headerTabl, allDataSelectUser) {
    for (let i=0; i< headerTabl.length; i++){
        // console.log(headerTabl[i], allDataSelectUser[i])
        // console.log(allDataSelectUser[i])
        userFromTab[headerTabl[i]] = allDataSelectUser[i]
    }
    console.log(userFromTab)
    return userFromTab
}
//Вывод на старницу новой инфы
function viewOnPageDateSelectUser(userFromTabObject) {
    for (let key in userFromTabObject){
        console.log(key, userFromTabObject[key] )
        out.innerHTML += `
             <div class="${key}">
                <p><b>${key}: </b>${userFromTabObject[key]}</p>
        </div>
        `
    }
}
//обнуление вывода на страницу
function clearOut() {
    out.innerHTML = ''
}

console.log(window.pageYOffset)// координаты окна при прокрутке
console.log(Number(window.pageYOffset + 55 )+'px')

//modal модальное окно
let modal = document.querySelector('.modal')
let buttonClose = document.querySelector('#close')
let modalInsert = document.querySelector('.modal-insert')//куда вставим модал
let coverDiv = document.createElement('div')//перекрываем боди при открытии модала
coverDiv.id = 'cover-div'
//закрываем модалку
buttonClose.onclick =()=>{
    modal.style.display = 'none'
    modalInsert.innerHTML = ''
    coverDiv.remove()
    document.body.style.overflowY = ''
}
//функц модальный вывод на старницу выбранного юзера
function insertInModal(userFromTabObject) {
    for (let key in userFromTabObject){
        modalInsert.innerHTML += `
             <div class=${key}">
                <p><b>${key}: </b>${userFromTabObject[key]}</p>
        </div>
        `
    }
    modal.style.top = `${window.pageYOffset + 50}px`
    // console.log(window.pageYOffset)
    // console.log(`${window.pageYOffset + 55}px`)
    document.body.style.overflowY = 'hidden'
    document.body.append(coverDiv)//втавляем в боди ковер
    modal.style.display = 'block'
}
//стралка перехода на верх
let upArrow = document.querySelector('.upArrow')
window.addEventListener('scroll', function() {
    let upArrow = document.querySelector('.upArrow')
    if (pageYOffset > 1000){
        upArrow.style.top = `${window.pageYOffset + 500}px`
        upArrow.style.display = 'block'
        console.log(pageYOffset)
    }
    else {
        upArrow.style.display = 'none'
    }
});
//функц перехода на верх страницы
upArrow.onclick = function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}