// Задание

// Создать страницу, имитирующую ленту новостей социальной сети Twitter.

// Технические требования:

// При открытии страницы, необходимо получить с сервера список всех пользователей и общий список публикаций.
// Для этого нужно отправить GET запрос на следующие два адреса:

// https://ajax.test-danit.com/api/json/users
// https://ajax.test-danit.com/api/json/posts

// После загрузки всех пользователей и их публикаций, необоходимо отобразить все публикации на странице.
// Каждая публикация должна быть отображена в виде карточки (пример: https://prnt.sc/q2em0x),
// и включать заголовок, текст, а также имя, фамилию и имейл пользователя, который ее разместил.
// На каждой карточке должна присутствовать иконка или кнопка, которая позволит удалить данную карточку со страницы.
// При клике на нее необходимо отправить DELETE запрос по адресу https://ajax.test-danit.com/api/json/posts/${postId}. 
//После получения подтверждения с сервера (запрос прошел успешно), карточку можно удалить со страницы, используя JavaScript.
// Более детальную информацию по использованию каждого из этих указанных выше API можно найти здесь.
// Данный сервер является тестовым. После перезагрузки страницы все изменения, которые отправлялись на сервер, не будут там сохранены. 
//Это нормально, все так и должно работать.
// Карточки обязательно должны быть реализованы в виде ES6 классов. Для этого необходимо создать класс Card.
// При необходимости, вы можете добавлять также другие классы.

// Необязательное задание продвинутой сложности

// Пока с сервера при открытии страницы загружается информация, показывать анимацию загрузки.
// Анимацию можно использовать любую. Желательно найти вариант на чистом CSS без использования JavaScript.
// Добавить вверху страницы кнопку Добавить публикацию. При нажатии на кнопку, открывать модальное окно, 
//в котором пользователь сможет ввести заголовок и текст публикации.
// После создания публикации данные о ней необходимо отправить в POST запросе по адресу: https://ajax.test-danit.com/api/json/posts. 
//Новая публикация должна быть добавлена вверху страницы (сортировка в обратном хронологическом порядке).
// В качестве автора можно присвоить публикации пользователя с id: 1.
// Добавить функционал (иконку) для редактирования содержимого карточки. 
//После редактирования карточки для подтверждения изменений необходимо отправить PUT запрос по адресу https://ajax.test-danit.com/api/json/posts/${postId}.



// SENSREQUEST


const newCardButton = document.querySelector('.add_card');
const cards = [];
const users = [];
const requestUsers = new XMLHttpRequest();
requestUsers.responseType = 'json';
requestUsers.open('GET', `https://ajax.test-danit.com/api/json/users`);
requestUsers.onload = response => {    
    const usersList = response.target.response;
    usersList.forEach(element => {
        const newUser = new User(element.id, element.name, element.email);
        users.push(newUser);
    });    
    const requestPosts = new XMLHttpRequest();
    requestPosts.responseType = 'json';
    requestPosts.open('GET', `https://ajax.test-danit.com/api/json/posts`);
    requestPosts.onload = response => {        
        const posts = response.target.response;
        posts.forEach(element => {            
            const userInfo = users[element.userId-1];
            const card = new Modal(userInfo.id, userInfo.name, userInfo.email);               
            card.addTitle = element.title;
            card.addText = element.body;
            card.addCardID = element.id;
            cards.push(card);            
        });       
    };
    requestPosts.send();    
        
};
requestUsers.send();

newCardButton.addEventListener('click', function(){
    const newCard = new Modal(users[0].id, users[0].name, users[0].email);
    newCard.deleteButton.style.display = 'none';    
    newCard.modifyButton.style.display = 'none';    
    newCard.saveButton = document.createElement('button');
    newCard.saveButton.innerText = 'Save changes';
    newCard.saveButton.style.display = 'block'; 
    newCard.card.insertAdjacentElement('afterbegin', newCard.saveButton);
    newCard.saveButton.addEventListener('click', function(){        
        const obj = {
            title: newCard.title.value,
            body: newCard.postText.value,
            userId: 1
        };

        JSON.stringify(obj);
        postRequest(obj, newCard);
    });
    cards.unshift(newCard);        
    document.querySelector('.cards').insertAdjacentElement('afterbegin', newCard.card);
    newCard.title.removeAttribute('disabled');
    newCard.title.setAttribute('placeholder', 'Enter new card title');
    newCard.postText.removeAttribute('disabled');
    newCard.postText.setAttribute('placeholder', 'Enter new card text');   
});

class User {
    constructor(id, name, email){
        this.id = id;
        this.name = name;
        this.email = email;        
    }
}



function postRequest(obj, elem){    
    const requestPosts = new XMLHttpRequest();
    requestPosts.responseType = 'json';
    requestPosts.open('POST', `https://ajax.test-danit.com/api/json/posts`);
    requestPosts.onload = response => {         
        if(response.returnValue){
            elem.saveButton.remove();                 
            elem.postText.setAttribute('disabled','disabled');
            elem.title.setAttribute('disabled','disabled');
            elem.addCardID = response.srcElement.response.id;
            elem.deleteButton.style.display = 'block';    
            elem.modifyButton.style.display = 'block';            
            elem.saveButton = document.createElement('button');
            elem.saveButton.innerText = 'Save changes';            
            elem.saveButton.addEventListener('click', elem.saveChanges.bind(elem));
            elem.card.insertAdjacentElement('afterbegin', elem.saveButton);
            elem.saveButton.style.display = 'none';
            alert('card was registered');
        }       
    };
    requestPosts.send(obj);    
}

function putRequest(json, id, obj, interval){           
    const request = new XMLHttpRequest();
    request.responseType = 'json';
    request.open('PUT', `https://ajax.test-danit.com/api/json/posts/${id}`);
    request.onload = (response) => {    
        if(response.srcElement.response.id === id){
            clearInterval(interval); 
            obj.saveButton.style.display = 'none';
            obj.saveButton.innerText = 'Save changes';
            obj.modifyButton.style.display = 'block';                 
            obj.title.setAttribute('disabled', 'disabled');
            obj.postText.setAttribute('disabled', 'disabled');
            alert('Modified successful');            
        }                   
    };    
    request.send(json);
}

function delRequest(id, elem){        
    const request = new XMLHttpRequest();
    request.responseType = 'json';
    request.open('DELETE', `https://ajax.test-danit.com/api/json/posts/${id}`);
    request.onload = response => {        
        if(response.returnValue){
            elem.card.remove();
            alert('successful delete');
        }        
    };
    request.send();
}

class Modal {
    constructor(id, name, email){
        this.id = id;
        this.name = name;
        this.email = email;
        this.card = document.createElement('div');
        this.card.setAttribute('person_id', id);        
        this.saveButton = document.createElement('button');
        this.saveButton.innerText = 'Save changes';
        this.saveButton.style.display = 'none';
        this.saveButton.addEventListener('click', this.saveChanges.bind(this));
        this.modifyButton = document.createElement('button');
        this.modifyButton.innerText = 'Modify post';
        this.modifyButton.addEventListener('click', this.modify.bind(this));
        this.deleteButton = document.createElement('button');
        this.deleteButton.innerText = 'Delete post';
        this.deleteButton.addEventListener('click', this.delete.bind(this));
        this.userName = document.createElement('input');
        this.userName.setAttribute('disabled', 'disabled');
        this.userName.value = name;
        this.userEmail = document.createElement('input');
        this.userEmail.value = email;
        this.userEmail.setAttribute('disabled', 'disabled');
        this.title =  document.createElement('input');
        this.title.setAttribute('disabled', 'disabled');
        this.postText = document.createElement('textarea');
        this.postText.setAttribute('disabled', 'disabled');
        this.postText.classList.add('post_text');
        this.card.insertAdjacentElement('beforeend', this.saveButton);
        this.card.insertAdjacentElement('beforeend', this.modifyButton);
        this.card.insertAdjacentElement('beforeend', this.deleteButton);
        this.card.insertAdjacentElement('beforeend', this.userName);
        this.card.insertAdjacentElement('beforeend', this.userEmail);
        this.card.insertAdjacentElement('beforeend', this.title);
        this.card.insertAdjacentElement('beforeend', this.postText);
        document.querySelector('.cards').insertAdjacentElement('beforeend', this.card);                    
    }
    set addTitle(title){        
        this.title.value = title;                    
    }
    set addText(text){       
        this.postText.value = text;         
    }
    set addCardID(value){       
        this.cardID = value;         
    }
    
    modify(){  
        this.saveButton.style.display = 'block';
        this.modifyButton.style.display = 'none';     
        this.title.removeAttribute('disabled');
        this.postText.removeAttribute('disabled');
    }
    saveChanges(){
        const button = this.saveButton;
        const loading = function(elem){
            button.insertAdjacentText('beforeend', '.');
        };
        const interval = setInterval(loading,
        500, button);

        const putObject = {
            'title' : this.title.value,
            'body' : this.postText.value,
            'userId': this.id,
            'id': this.cardID            
        };

        putRequest(JSON.stringify(putObject), this.cardID, this, interval);
    }
    delete(){
        delRequest(this.cardID, this);    
    }  
}