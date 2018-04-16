/*
// 导入WebSocket模块:
const WebSocket = require('ws');
// 引用Server类:
const WebSocketServer = WebSocket.Server;
// 实例化:
const wss = new WebSocketServer({
    port: 3000
});
wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        ws.send(`ECHO: ${message}`, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
    })
});
*/

const parseUser = require('./utils/parseUser')

// 消息ID:
var messageIndex = 0;

function createMessage(type, user, data) {
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

module.exports = (server) => {
    // 创建WebSocketServer:
    let wss = new WebSocketServer({
        server: server
    });
    wss.broadcast = function (data) {
        wss.clients.forEach(function (client) {
            client.send(data);
        });
    };
    wss.on('connection', function (ws) {
        // ws.upgradeReq是一个request对象:
        let user = parseUser(ws.upgradeReq);
        if (!user) {
            // Cookie不存在或无效，直接关闭WebSocket:
            ws.close(4001, 'Invalid user');
        }
        // 识别成功，把user绑定到该WebSocket对象:
        ws.user = user;
        // 绑定WebSocketServer对象:
        ws.wss = wss;
        ws.on('message', function (message) {
            console.log(message);
            if (message && message.trim()) {
                let msg = createMessage('chat', this.user, message.trim());
                this.wss.broadcast(msg);
            }
        });
    });
}