var io = require('socket.io')(process.env.PORT || 3000);

const arrUserInfo = [];

io.on('connection', socket => {
    socket.on('nguoi-dung-dang-ky', userName => {
        const isExist = arrUserInfo.some(e => e.ten === userName.ten);
        socket.peerID = userName.peerID;
        if (isExist) {
            return socket.emit('dang-ky-that-bai');
        } else {
            arrUserInfo.push(userName);
            socket.emit('danh-sach-online', arrUserInfo);
            socket.broadcast.emit('co-nguoi-dung-moi', userName);
        }
    });
    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(userName => userName.peerID === socket.peerID);
        arrUserInfo.splice(index, 1);
        io.emit('ai-do-logout', socket.peerID);
    });
});