

//  every client li has a onclick attibute which calls this loadMessages function
//  and also sends their user id with it. this function calls from sidepanel_clients.html clients li.
function loadMessages(userid){
    
    // 1) send a ajax request to get all messages
    // of a user through its userid
    const get_messages = new XMLHttpRequest();
    let link = 'http://127.0.0.1:5000/get_messages/' + userid;
    console.log(link)
    
    get_messages.open('GET', link, true);

    get_messages.send()

    get_messages.onprogress = function(){
        console.log("fetching client messages from database");
    };

    get_messages.onload = function(){
        console.log("received a response.")
        let response = JSON.parse(this.responseText);
        let messages = response['messages'];
        let client_pic = response['client_pic'];
        
        let host = response['host'];
        let port = response['port'];

        create_message_list(messages, client_pic);

        //showing connecting status
        show_status_bar(userid, host, port);

        //connecting to user
        connect_to_user(userid, host, port);

    };

};


function create_message_list(messages, client_pic){

    // getting unordered list
    let ulist = document.getElementById("messages");
    ulist.innerHTML = "";

    for (let index = 0; index < messages.length; index++) {

        // creating list elements
        let li = document.createElement('li');
        let img = document.createElement('img');
        let p = document.createElement("p");

        // adding image source
        img.src = "static/images/" + client_pic;

        // adding text to p tag
        let messg = messages[index];

        if (messg.includes('client:')){
            li.classList.add("replies");
            let p_text = document.createTextNode(messg.replace("client: ", ''));
            p.appendChild(p_text);
        }else{
            li.classList.add("sent");
            let p_text = document.createTextNode(messg.replace("me: ", ''));
            p.appendChild(p_text);
        }
        
        

        li.appendChild(img);
        li.appendChild(p);

        if (messg.length>0){
            ulist.appendChild(li);
            console.log("showing message:" + messg)
        }else{
            console.log("message is empty that's why not showing it:" + messg);
        }
        
        
    };
};


function delete_user(){
    console.log("delete called")
    let id = document.getElementById("delete_id").value;

    // sendig ajax request to deleting messges
    const delete_request = new XMLHttpRequest();

    delete_request.open('GET', '/delete_user/'+id, true);

    delete_request.send();

    delete_request.onload = function(){
        window.location.reload();
    }

    // 
}

function show_status_bar(userid, host, port){
    let status_bar = document.getElementById("status-bar");
    status_bar.style.display = 'block';

    let delete_id = document.getElementById("delete_id");
    delete_id.value = userid;
    delete_id.style.display = 'none';

    // deleteing a user
    let delete_btn = document.getElementById("delete_user");
    delete_btn.addEventListener('click', delete_user)

    //removing style from other lists
    let lists = document.getElementsByClassName("contact");
    for (let index = 0; index < lists.length; index++) {
        let element = lists[index];
        element.style.backgroundColor = 'white';
        element.style.borderLeft = 'none';
    }


    // adding style to current list
    let user_li = document.getElementsByClassName("user_" + userid)[0];
    if (user_li!=null){
        user_li.style.backgroundColor = '#EDEDED';
        user_li.style.borderLeft = '4px solid #dacb58'
    }else{
        // show user li here
        let ul = document.getElementsByTagName('ul')[0];

        let ip = host;
        // let port = port;
        let li = document.createElement('li');
        li.setAttribute("class", "contact user_" + userid);
        li.style.backgroundColor = "rgb(237, 237, 237)";
        li.style.borderLeft = "4px solid rgb(218, 203, 88)";
        let liInner = '<div class="wrap"> \
        <span class="contact-status d-none" style="display: none;"></span>\
        <img src="/static/images/default.jpg" alt="user profile pic">\
        <div class="meta">\
            <p class="name">' + ip+ ':' + port+ '</p><p class="preview"></p></div></div>'
        
        li.innerHTML = liInner;

        ul.appendChild(li);
    }
    

};

function connect_to_user(user_id, host, port){
    console.log('user id: ' + user_id);

        const req = new XMLHttpRequest();

        req.open('POST', 'http://127.0.0.1:5000/newclient', true);
        req.setRequestHeader("Content-type", "application/json");

        req.onprogress = function(){
            console.log('Progression');
            // document.getElementById('connection-text').value = "Connection in progres ...";
        };

        req.onload = function(){
            if (this.responseText == 'client connected'){

                let input_box = document.getElementsByClassName("message-input")[0];
                input_box.style.display = 'block';
                console.log("client connected successfully")

                // saving current user in browser storage
                sessionStorage.setItem("current_host", host);
                sessionStorage.setItem("current_port", port);

                //removing dots from other user icons
                let li = document.getElementsByClassName("contact-status")
                for (let index = 0; index < li.length; index++) {
                    let icon = li[index];
                    icon.style.display = 'none';
                }

                // showing green dot on sidebar
                let user_li = document.getElementsByClassName("user_" + user_id)[0];
                user_li.children[0].children[0].classList.add("online");
                user_li.children[0].children[0].style.display = 'block';
                user_li.children[0].children[0].classList.remove("d-none");

            };
            if (this.responseText == 'client not available'){
                // hiding input box
                let input_box = document.getElementsByClassName("message-input")[0]
                input_box.style.display = 'none';
                console.log("client not available")
                

                //removing dots from other user icons
                let li = document.getElementsByClassName("contact-status")
                for (let index = 0; index < li.length; index++) {
                    let icon = li[index];
                    icon.style.display = 'none';
                }

                // showing offline dot on sidebar
                let user_li = document.getElementsByClassName("user_" + user_id)[0];
                user_li.children[0].children[0].classList.add("offline");
                user_li.children[0].children[0].style.display = 'block';
                user_li.children[0].children[0].classList.remove("d-none");
            };

        };
        query2 = {"host": host, 'port': port}

        req.send(JSON.stringify(query2))
};



