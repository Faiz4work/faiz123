

// getting connect button
let connectBtn = document.getElementById("connectBtn");

// adding event listener to register user to database
connectBtn.addEventListener('click', addUserToDatabase)

function addUserToDatabase(){

    // getting host port and user values
    uname = document.getElementById("uname").value;
    host = document.getElementById("host").value;
    port = document.getElementById("port").value;

    $('.close').click();

    // making an ajax request for adding user to database and returning it's id
    const addUser = new XMLHttpRequest();

    addUser.open('POST', '/connect', true);
    addUser.setRequestHeader('Content-Type', 'application/json');

    value = {'username' : uname , 'host': host, 'port': port};
    query = JSON.stringify(value);
    console.log(query)


    addUser.onprogress = function(){
        console.log("Request sent!")
        
    }

    // sending the request
    addUser.send(query)

    // receiving response
    addUser.onload = function(){
        user_id = JSON.stringify(this.responseText);
        window.location.reload()

        
        // loadMessages_fromModal(user_id)
    };


};
