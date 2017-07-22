var socket = io('https://mypeer791.herokuapp.com/');
$('#div-chat').hide();
socket.on('danh-sach-online', arrUserInfo => {
    $('#div-chat').show(2000);
    $('#div-dang-ky').hide(1000);
    arrUserInfo.forEach(userName => {
        const { ten, peerID } = userName;
        $('#ulUser').append(`<li id="${peerID}">${ten}</li>`);
    });
    socket.on('co-nguoi-dung-moi', userName => {
        const { ten, peerID } = userName;
        $('#ulUser').append(`<li id="${peerID}">${ten}</li>`);
    })
    socket.on('ai-do-logout', peerID => {
        $(`#${peerID}`).remove();
    })
});

socket.on('dang-ky-that-bai', () => alert('User da ton tai! Vui long nhap user khac'));

function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream', stream));
var peer = new Peer({ key: 'peerjs', host: 'https://mypeer791.herokuapp.com/', secure: true, port: 443 });
//login

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const userName = $('#txtUsername').val();
        socket.emit('nguoi-dung-dang-ky', { ten: userName, peerID: id });
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteID').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

//Callee
peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

//user caller
$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});