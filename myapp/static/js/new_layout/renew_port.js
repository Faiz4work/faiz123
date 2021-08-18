// attached with ports_modal.html
let renewBtn = document.getElementById('renewPort');
renewBtn.addEventListener('click', renewPort);

function renewPort(){
    const req = new XMLHttpRequest();

    req.open('GET', 'http://127.0.0.1:5000/renewport', true)
    document.getElementById('mynewport').innerText = "Getting Port...";
    console.log('Getting New Port');


    req.onload = function(){
        response = JSON.parse(this.responseText);
        document.getElementById('mynewport').innerText = response['port'];
        // console.log(response['port']);


    };

    req.send();
};