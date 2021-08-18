var new2 = io.connect('http://127.0.0.1:5000');

// when connected to client
new2.on('connect', function(){

    new2.on('flash_message', function(flash_msg){
        alert(flash_msg);
    });
    

    // when receive message from client 
    new2.on('new_message', function(msg){

        let myhost = document.getElementById("myhost").innerText;
        console.log(myhost)

        host = msg['host'];
        port = msg['port'];
        message = msg['message'];

        if (myhost==host){
            host = "";
            console.log("same host")
        }

        new_client = false

        // check it the client is new or current client
        let current_host = sessionStorage.getItem("current_host");
        let current_port = sessionStorage.getItem("current_port");
        if (current_host!=null & current_port!=null){
            if(current_host==host & current_port==port){
                new_client = false;
                console.log("old client")
            }
            else{
                new_client = true;
                console.log("new client and also has sessionStorage")
            };

        }else{
            sessionStorage.removeItem("current_host");
            sessionStorage.removeItem("current_port");
            sessionStorage.setItem("current_host", host);
            sessionStorage.setItem("current_port", port);
            new_client = true
            console.log("new client")
        };
        

        if (new_client){
            // ask from user if he wants to connect it now or not
            want_to_connect = false;
            let conf = confirm("There is a message in your inbox, do you want to connect to it now?");
            if (conf){
                want_to_connect = true
            }else{
                want_to_connect = false
                 }
            // if he wants to connect now, then 
                if (want_to_connect){
                    // register client first, then
                        let client_id = registerUser(host, port, message);
            
                    // save it's message to database, then
                        //send message function is on registerUser function
                    // return to homepage with connect to that client and
                        // invoking from saveMessage function.
                    // show message on message board.
                        // clickUserLi(client_id);
                    }else{
                        // if he don't wants to connect then
                        // register user, then
                            notificationRegisterUser(host, port);
                        // save it's message to database then
                                // make a notification table attached with user, one-to-many 
                        // save notification to notifications table with user_id
                        // append notifications list on homepage with javascript client side
                        // send notifications list from homepage route to homapage.html
                        console.log("you don't want to connect.")
                    };
        }else{
            // save message to database, then
            let cid = sessionStorage.getItem("current_client");
            onlySaveMessage(cid, message)
            // show in message box.
            $('<li class="replies"><img src="static/images/default.jpg" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
            // $('.message-input input').val(null);
            $('.contact.active .preview').html('<span>You: </span>' + message);
            console.log(message)
            let scrol = document.getElementsByClassName("messages")[0];
            scrol.scrollBy(0, 99999999)
        };
        
    });
});

function registerUser(host, port, message){
    const reg = new XMLHttpRequest();

    reg.open('POST', '/connect', true);
    reg.setRequestHeader("Content-Type", "application/json");

    query = {'host': host, 'port': port, 'username': ''};

    reg.send(JSON.stringify(query));

    reg.onload = function(){
        saveMessage(this.responseText, message)
        console.log(this.responseText, message)
    }
};

function saveMessage(client_id, message){

    console.log(client_id, message);
    // save message to database
    const sMess = new XMLHttpRequest();

    sMess.open('POST', '/save_message', true);
    sMess.setRequestHeader("Content-Type", "application/json");

    query = {'message': message, 'user_id': client_id}

    sMess.send(JSON.stringify(query));

    sMess.onload = function(){
        if(this.responseText == 'added'){
            console.log('message saved')
        }else{
            console.log('message not saved!')
        }
        
        // change location to homepage
        // when page fully loaded, click on new user li

        page_load_then_click(client_id)
        
    };

};

function page_load_then_click(client_id){
    sessionStorage.setItem("click_li", "true");
    sessionStorage.setItem("client_id", client_id);
    sessionStorage.setItem("current_client", client_id);
    console.log("client id from page load: " + client_id)
    window.location.reload();
}

function onlySaveMessage(client_id, message){
        // save message to database
        const sMess = new XMLHttpRequest();

        sMess.open('POST', '/save_message', true);
        sMess.setRequestHeader("Content-Type", "application/json");
    
        query = {'message': message, 'user_id': client_id}
    
        sMess.send(JSON.stringify(query));
    
        sMess.onload = function(){
            if(this.responseText == 'added'){
                console.log('only message saved')
            }else{
                console.log('message not saved!')
            }      
        };
};

function notificationRegisterUser(host, port){
    const reg = new XMLHttpRequest();

    reg.open('POST', '/connect', true);
    reg.setRequestHeader("Content-Type", "application/json");

    query = {'host': host, 'port': port, 'username': ''};

    reg.send(JSON.stringify(query));

    reg.onload = function(){
        onlySaveMessage(this.responseText, message)
        saveNotification(this.responseText, host, port)
        console.log(this.responseText)
    }
};

function saveNotification(client_id, host, port){
    // add notification to notification list.
    console.log("making notification")
    let drop_menu = document.getElementsByClassName("drop_menu")[0];

    let a = document.createElement("a");

    a.classList.add("dropdown-item");
    // a.data_toggle = "modal";

    let span = document.createElement("span");
    span.onclick = function(){
        connectUser(client_id);
    };

    span.classList.add("n_"+client_id);
    span.innerText = host + ":" + port;

    a.appendChild(span);
    drop_menu.appendChild(a);


    // <a class="dropdown-item" data-toggle="modal">
    // <span onclick="connectUser({{notification.user_id}})"
    // class="n_{{notification.user_id}}">
    // client username or ip port</span></a>

    console.log("notification done!")

    // send client id to save a notification.
    const saveNotification = new XMLHttpRequest();

    saveNotification.open('POST', '/save_notification', true);
    saveNotification.setRequestHeader("Content-Type", "application/json");

    saveNotification.send(JSON.stringify({'id': client_id}));

    saveNotification.onload = function(){
        if (this.status == 200){
            console.log("notification saved!")
        }else{
            console.log("notification not saved")
        }
    }

};

// connect to user according to notification id
function connectUser(client_id){
    // remove notification from database and from notificatioin list
    removeNotification(client_id);

    // loadMessages(client_id) // loading messages by clicking on id
    // and connecting with them;
    

    
};

function removeNotification(client_id){
    // remove notification from notifcation list
    let notification = document.getElementsByClassName("n_"+client_id)[0];
    notification.style.display = 'none';

    // remove from database
    const rmnotification = new XMLHttpRequest();
    rmnotification.open('POST', '/remove_notification', true);
    rmnotification.setRequestHeader("Content-Type", "application/json");

    rmnotification.send(JSON.stringify({'id': client_id}));

    rmnotification.onload = function(){
        if (this.status == 200){
            console.log('notification removed');
            loadMessages(client_id);
        }else{
            console.log('notification not removed!')
        }
    };

};