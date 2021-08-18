// working on register.html for registering users
let reg = document.getElementById('register');
reg.addEventListener('click', RegisterUser);

// working on register.html for registering user
function RegisterUser(){
    const req = new XMLHttpRequest();

    req.open('GET', 'http://127.0.0.1:5000/renewport', true)

    // req.onprogress = function(){
    //     console.log(document.getElementById('port').innerText)
    //     document.getElementById('port').innerText = "Getting Port...";
    //     console.log('working')
        

    // };

    req.onload = function(){
        response = JSON.parse(this.responseText);
        document.getElementById('port').innerText = response['port'];
        console.log(response['port']);


    };

    req.send();
};