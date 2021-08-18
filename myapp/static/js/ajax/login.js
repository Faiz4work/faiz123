
function startServer(){
    const obj = new XMLHttpRequest();

    obj.open('GET', 'http://127.0.0.1:5000/server', true);

    obj.onprogress = function(){
        console.log('sending request')
    };

    obj.onload = function(){
        if (this.responseText == "0"){
            alert("Port already in use please register a new port. you are redirecting to registeration page:")
            window.location.href = "http://127.0.0.1:5000/register";
        };
        let ip = JSON.parse(this.responseText)['ip'];
        let port = JSON.parse(this.responseText)['port'];
        

        let port_span = document.getElementById('port');
        port_span.innerHTML = port;

        let ip_span = document.getElementById('ip');
        ip_span.innerHTML = ip;
    };
    obj.send()
};

startServer();