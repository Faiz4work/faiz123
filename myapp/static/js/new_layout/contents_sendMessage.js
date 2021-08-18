$(".messages").animate({ scrollTop: $(document).height() }, "fast");



function showMessage() {
message = $(".message-input input").val();
if($.trim(message) == '') {
    return false;
}
$('<li class="sent"><img src="static/images/default.jpg" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
$('.message-input input').val(null);
$('.contact.active .preview').html('<span>You: </span>' + message);

};

$('.submit').click(function() {

    sendMessage();
    
});

$(window).on('keydown', function(e) {
if (e.which == 13) {
    sendMessage();
    // return false;
}
});


function sendMessage(){
    message = $(".message-input input").val();
    if (message==''){
        return false;
    }
    console.log(message);


    // instantial a xhr object
    const xhr = new XMLHttpRequest();
    // getting my host and port
    let myhost = document.getElementById("myhost").innerText;
    let myport = document.getElementById("myport").innerText;

    // getting message value
    // document.getElementById('message').value = '';

    // Open the object
    xhr.open('POST', 'http://127.0.0.1:5000/send_message', true);
    xhr.setRequestHeader("Content-Type", "application/json")

    // Load object, onpogress
    xhr.onprogress = function(){
        console.log('Sending message')
    }

    // when all load
    xhr.onload = function(){
        if (this.responseText == 'not connected'){
            window.location.href = 'http://127.0.0.1:5000';
            console.log('not connected');
        }else{
            showMessage();
            console.log("from else block")
            console.log(this.responseText);
            let scrol = document.getElementsByClassName("messages")[0];
            scrol.scrollBy(0, 99999999)
        }
        
    };

    // send the request

    xhr.send(JSON.stringify({'sendMessage': message, 'host': myhost, 'port': myport}))
};



