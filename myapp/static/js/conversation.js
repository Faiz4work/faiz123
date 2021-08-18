
// Working on conversation/chat.html
let sendMessage = document.getElementById('sendBtn');
sendMessage.addEventListener('click', sendMessagetoUser);

// adding "enter" key event, when a user press enter key
let input_bar = document.getElementById('message');
input_bar.addEventListener('keydown', function(e){
    if(e.code === "Enter"){
        sendMessagetoUser();
    };
});



function sendMessagetoUser(){
    // instantial a xhr object
    const xhr = new XMLHttpRequest();
    // getting my host and port
    let myhost = document.getElementById("myip").innerText;
    let myport = document.getElementById("myport").innerText;

    // getting message value
    let message = document.getElementById('message').value;
    document.getElementById('message').value = '';

    // Open the object
    xhr.open('POST', 'http://127.0.0.1:5000/send_message', true);
    xhr.setRequestHeader("Content-Type", "application/json")

    // Load object, onpogress
    xhr.onprogress = function(){
        console.log('Sending message')
    }

    // when all load
    xhr.onload = function(){
        console.log(this.responseText)
        if (this.responseText == 'not connected'){
            window.location.href = 'http://127.0.0.1:5000';
        };
        let node = document.createElement('li');
        let text = document.createTextNode(' me: ' + message);
        
        node.appendChild(text);
        document.getElementById('new').appendChild(node);

        //scrolling to bottom
        var objDiv = document.getElementById("msgbody");
        objDiv.scrollTop = objDiv.scrollHeight;
    };

    // send the request

    xhr.send(JSON.stringify({'sendMessage': message, 'host': myhost, 'port': myport}))

}

// checking the user is online or not
window.addEventListener("load", checkOnlineUser);

function checkOnlineUser(){
    host = document.getElementById("ip").innerText;
    port = document.getElementById("port").innerText;
    console.log(host)
    console.log(port)
    const req = new XMLHttpRequest();

    req.open('POST', 'http://127.0.0.1:5000/newclient', true);
    req.setRequestHeader("Content-type", "application/json");

    req.onreadystatechange = function(){
        if (this.readyState == 2){
            document.getElementById("status").innerText = "Checking user status...";
        };
    };

    req.onprogress = function(){
        console.log('Progression');
        document.getElementById("status").innerText = "Connecting to user...";
    };
    
    req.onload = function(){
        console.log(req.status)
        console.log(this.responseText)
        if (this.responseText == 'client connected'){
            document.getElementById("status").innerText = "Connected successfully";

        };
        if (this.responseText == 'client not available'){
            document.getElementById("status").innerText = "User offline!";
        };

    };
    query2 = {"host": host, "port": port}
    console.log(query2)
    req.send(JSON.stringify(query2))
};