document.addEventListener('DOMContentLoaded', () => {
    const btnOpen = document.getElementById('run');
    const btnStop = document.getElementById('stop');
    const status = document.getElementById('status');
    btnStop.setAttribute('disabled', true);
    status.innerText = 'Disconnected';
    const input = document.getElementsByTagName('input')[0];
    let websocket;

    function startApp() {

        btnOpen.addEventListener('click', async () => {
            try {
                await createWebSocket();
                btnOpen.setAttribute('disabled', true);
                btnStop.removeAttribute('disabled');
                status.innerText = 'Connected';
                status.style.color = 'green';
            } catch {
                alert('Try again!');
            }
        });

        btnStop.addEventListener('click', () => {
            websocket.close(1000, 'Connection was closed');
            status.innerText = 'Disconnected';
            status.style.color = 'red';
        })

    }

    function createWebSocket() {
        return new Promise((res, rej) => {
            websocket = new WebSocket('ws://127.0.0.1:3000/', 'echo-protocol');
            websocket.onopen = function () {
                input.addEventListener('input', listenToInput);
                websocket.send(input.value);
                res(websocket);
            };

            function clearWebSocketData() {
                websocket = undefined;
                input.removeEventListener('input', listenToInput);
                btnOpen.removeAttribute('disabled');
                btnStop.setAttribute('disabled', true);
            }

            websocket.onerror = function (e) {
                clearWebSocketData();
                rej(e);
            };

            websocket.onmessage = ({ data }) => console.log(data);

            websocket.onclose = clearWebSocketData;

        })
    }

    function listenToInput() {
        websocket.send(input.value);
    }

    startApp();
})













