
const Peer = require('simple-peer');
const $ = require('jquery')


function OpenCamera(){
    navigator.mediaDevices.getUserMedia({audio:true, video: true})
    .then(stream => {
        const p = new Peer({initiator: location.hash === '#1', trickle: false , stream: stream})
        PlayVideo(stream, "localStream");
        p.on('signal', token => {
            $('#txtmysignal').val(JSON.stringify(token))
        })


        
        $('#btnconnect').click(()=>{
            const friendsignal = JSON.parse($('#txtfriendsignal').val())
            p.signal(friendsignal)
        })
        
        p.on('stream', friendstream => {
            PlayVideo(friendstream,"friendStream")
        })
    })
    .catch(err => console.log(err))
}


function PlayVideo(stream, videoid){
    const video =document.getElementById(videoid);
      video.srcObject = stream;
      video.onloadedmetadata = function(){
        video.play();
      }
}



OpenCamera();









