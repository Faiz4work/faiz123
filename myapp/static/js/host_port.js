// working on host_port.html
let sclient = document.getElementById("myinput")
sclient.addEventListener('click', startClient);

function startClient(){
    host = document.getElementById('host').value;
    port = document.getElementById('port').value;

    const req = new XMLHttpRequest();

    req.open('POST', 'http://127.0.0.1:5000/newclient', true);
    req.setRequestHeader("Content-type", "application/json");

    req.onprogress = function(){
        console.log('Progression');
        document.getElementById('connection-text').value = "Connection in progres ...";
    };

    req.onload = function(){
        if (this.responseText == 'client connected'){
            document.getElementById('connection-text').innerText = 'Connected. now you can chat by clicking on below button.';

            let p = document.getElementById('chat')
            p.style.display = 'block'

        };
        if (this.responseText == 'client not available'){
            document.getElementById('connection-text').innerText = 'This client is offline or not available at the moment!';
        };

    };
    query = "host=" + host + "&port=" + port
    query2 = {"host": host, 'port': port, 'first_connection': 'yes'}

    req.send(JSON.stringify(query2))

}