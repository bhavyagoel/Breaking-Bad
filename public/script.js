
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const content = document.querySelector('.content');
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
})

    socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

image = document.querySelector('#transcript #pop')

const everywhere = (data) => {
    content.textContent = data;
}

socket.on('chat-message', data => {
    everywhere(data);
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
    video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

const btn = document.querySelector('.talk');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function() {
    console.log('start');
}

recognition.onresult = function(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    socket.emit('send-message', content.textContent);
}

btn.addEventListener('click', () => {
    recognition.start();
});

const convert = document.querySelector('.convert');
const before = document.querySelector('#before');
const after = document.querySelector('#after');
convert.addEventListener('click', () => {
    let i = 0;
    before.addEventListener('click', () => {
        i -= 1;
        imgName = content.textContent[i] + '.png';
        document.querySelector('#pop').style.backgroundImage = "url("+imgName+")";
        console.log(content.textContent[i]);
    })
    after.addEventListener('click', () => {
        i += 1;
        imgName = content.textContent[i] + '.png';
        document.querySelector('#pop').style.backgroundImage = "url("+imgName+")";
        console.log(content.textContent[i]);
    })
    imgName = content.textContent[i] + '.png';
    document.querySelector('#pop').style.backgroundImage = "url("+imgName+")";
    console.log(content.textContent[i]);

})