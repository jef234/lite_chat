$(document).ready(function () {
    let textarea = document.querySelector("#text_message"),
        chatName = document.querySelector("#chat-name"),
        status = document.querySelector("#status"),
        messages = document.querySelector("#chat-messages");
    statusDefualt = status.textContent,
        setStatus = function (s) {
            status.textContent = s;

            if (s !== statusDefualt) {
                var delay = setTimeout(function () {
                    setStatus(statusDefualt);
                    clearInterval(delay);
                }, 3000);
            }
        };

    try {
        var socket = io.connect("http://127.0.0.1:8080");
    } catch (e) {
        //Set status to warn user
        console.log("ERROR!!")
        console.log(e);
    }

    if (socket != undefined) {
        //Listen for output
        socket.on("output", function (data) {
            console.log(data);
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    let message = document.createElement("div");

                    message.setAttribute("class", "chat-message");
                    message.textContent = data[i].name + ": " + data[i].message;

                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);
                }
            }
        })

        //Listen for status
        socket.on("status", function (data) {
            setStatus((typeof data === "object") ? data.message : data);

            if (data.clear === true) {
                textarea.value = '';
            }
        });
        //Listen for keydown
        textarea.addEventListener('keydown', function (event) {
            var self = this,
                name = chatName.value;

            if (event.which === 13 && event.shiftKey === false) {
                socket.emit('input', {
                    name: name,
                    message: self.value
                });
                event.preventDefault();
            }
        })
    }
});