const textBox = document.querySelector("textarea");
const addButton = document.querySelector("#addButton");
const commentsBox = document.querySelector(".comments");
const date = new Date();

addButton.addEventListener("click", postComment);
textBox.addEventListener("keyup", (event)=>{
    if(event.code==="Enter"){
        postComment();
    }
})

window.onload = function(){
    fetch("https://hello-world-401001.wm.r.appspot.com/getComments")
    .then((response)=> response.json())
    .then((data)=>{
        console.log(data);
        console.log(data.length);

        data.forEach((element)=>{
            const comment = document.createElement("div");
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-danger");
            deleteButton.classList.add("mb-5");
            deleteButton.addEventListener("click", ()=>{
                deleteComment(element._id);
            });
            const editButton = document.createElement("button");
            editButton.innerHTML = "Save Edit";
            editButton.classList.add("btn");
            editButton.classList.add("btn-success");
            editButton.classList.add("mb-5");
            editButton.addEventListener("click", ()=>{
                saveEdit(comment.lastChild.previousSibling.previousSibling.value, element._id);
            });
            comment.id = element._id
            try{
                comment.innerHTML = `${getMonth(element.date.month)} ${element.date.day}, ${element.date.year} <br>${getTime(element.date.hour, element.date.minutes)}<textarea class="comment w-100 p-5 mb-3 mt-3 bg-dark-subtle">${element.comment}</textarea>`;
            }
            catch{
                comment.innerHTML = `<textarea class="comment w-100 p-5 mb-3 mt-3 bg-dark-subtle">${element.comment}</textarea>`;
            }
            comment.append(deleteButton);
            comment.append(editButton);
            commentsBox.append(comment);  
        })
    })
}

function deleteComment(id){
    alert(`delete ${id}`);
    
    let message = {
        _id: id
    }

    fetch("https://hello-world-401001.wm.r.appspot.com/deleteComments",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    })
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        document.getElementById(id).remove();
    })
}

function postComment(){
    let message = {
        comment: textBox.value,
        date: {
            "month": date.getMonth()+1,
            "day": date.getDate(),
            "year": date.getFullYear(),
            "hour": date.getHours(),
            "minutes": date.getMinutes()
        }
    }

    console.log(message);

    textBox.value="";

    fetch("https://hello-world-401001.wm.r.appspot.com/postComments",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    })
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        const comment = document.createElement("div");
        comment.innerHTML = `${getMonth(data[0].date.month)} ${data[0].date.day}, ${data[0].date.year} <br>${getTime(data[0].date.hour, data[0].date.minutes)}<textarea class="comment w-100 p-5 mb-3 mt-3 bg-dark-subtle">${data[0].comment}</textarea>`;
        commentsBox.append(comment);  
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.classList.add("btn");
        deleteButton.classList.add("btn-danger");
        deleteButton.classList.add("mb-5");
        deleteButton.addEventListener("click", ()=>{
            deleteComment(data[0]._id);
        });
        const editButton = document.createElement("button");
        editButton.innerHTML = "Save Edit";
        editButton.classList.add("btn");
        editButton.classList.add("btn-success");
        editButton.classList.add("mb-5");
        editButton.addEventListener("click", ()=>{
            saveEdit(comment.lastChild.previousSibling.previousSibling.value, data[0]._id);
        });
        comment.id = data[0]._id
        comment.append(editButton);
        comment.append(deleteButton);
        
    })
}

function saveEdit(edit, id){
    let message = {
        comment: edit,
        _id: id,
        date: {
            "month": date.getMonth()+1,
            "day": date.getDate(),
            "year": date.getFullYear(),
            "hour": date.getHours(),
            "minutes": date.getMinutes()
        }
    }

    fetch("https://hello-world-401001.wm.r.appspot.com/update",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    })
    .then((response)=>{return response.json()})
    .then((data)=>{
        console.log(data);
        alert("Successfully saved edit")
    })
}

function getMonth(month){
    switch(Number(month)){
        case 1:
            return "January";
            break;
        case 2:
            return "February";
            break;
        case 3:
            return "March";
            break;
        case 4:
            return "April";
            break;
        case 5:
            return "May";
            break;
        case 6:
            return "June";
            break;
        case 7:
            return "July";
            break;
        case 8:
            return "August";
            break;
        case 9:
            return "September";
            break;
        case 10:
            return "October";
            break;
        case 11:
            return "November";
            break;
        case 12:
            return "December";
            break;
    }
}

function getTime(hour,minute){
    if(hour>12){
        if(minute<10){
            minute = "0"+ String(minute);
        }
        return String(`${hour-12}:${minute} PM`);
    }
    else{
        if(minute<10){
            minute = "0"+ String(minute);
        }
        return String(`${hour}:${minute} AM`);
    }
}