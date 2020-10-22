document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('run');
    const input = document.getElementsByTagName('input')[0];
    let websocket;

    function startApp() {

        btn.addEventListener('click', async () => {
            try {
                await createWebSocket();
                btn.setAttribute('disabled', true)
            } catch {
                alert('Try again!');
            }
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
                btn.removeAttribute('disabled');
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













