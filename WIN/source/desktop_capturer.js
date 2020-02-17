const {desktopCapturer} = require('electron');
const ipcRendererShareScreen = require('electron').ipcRenderer;

var key = '';

ipcRendererShareScreen.on('share-screen',async function(event, message) {
  var msgJSON = JSON.parse(message);console.log('share-screen IPC_RENDERER',message);

  key = msgJSON.key;
  switch (msgJSON.key) {
    case 'sources1':
    navigator.mediaDevices.getDisplayMedia = () => {
      return navigator.mediaDevices.getUserMedia({
         audio: false,
         video: {
           mandatory: {
             chromeMediaSource: 'desktop',
             chromeMediaSourceId: 123,
             minWidth: 1280,
             maxWidth: 1280,
             minHeight: 720,
             maxHeight: 720
           }
         }
       })
      }
    break;
    case 'sources2':
            var media = navigator.mediaDevices.getDisplayMedia({audio: false, video:{cursor:"always"}}).then(function(media){return media;})
        .catch(err => { console.error("Error:" + err); return null; });
        break;
    case 'sources':
    
        var sources = await showSourcesToMain();
        window.document.getElementById('screen-share-box').setAttribute("style","");
        manageTabs();
        console.log('showSourcesToMain', sources);
        sources.map(function(s, i){
          addSource(s);
          // s.thumbnail = s.thumbnail.toDataURL();
          return s;
        });
        break;
        // ipcRendererShareScreen.send('share-screen',{'sources':sources});
  }
});
//used to manage/handle screen share start / stop
let desktopSharing = false;
let localStream;

function refresh() {
  //if wants to use some plugin to refresh thumbnail images
  document.getElementById('buttonCancel').onclick = function(e){
    window.document.getElementById('screen-share-box').setAttribute("style","display: none;");
    window.document.getElementById('applicationTabContainer').innerHTML = '';
  }
  document.getElementById('buttonShare').onclick = function(e){
    var els = document.getElementsByName('screen');
    console.log(els)
    for (var i = 0; i < els.length; i++) {
      console.log(els[i])
      console.log(els[i].checked,els[i].value)
      if(els[i].checked){
        toggle(els[i].value);
    window.document.getElementById('screen-share-box').setAttribute("style","display: none;");
    window.document.getElementById('applicationTabContainer').innerHTML = '';
      }
    }
  }
}

function addSource(source) {
  var id =  source.id;//.split(":").join("");
  var name = source.name;
  var imgDataURL =  source.thumbnail.toDataURL();
  //add details to any tag
    if(name==='Entire screen'){
      window.document.getElementById('entireImage').src = imgDataURL;
      window.document.getElementById('entireRadio').value = id;
	  window.document.getElementById('entireRadio').checked = false;
      window.document.getElementById('entireLabel').innerHTML = name;
    }else{
      var screens = window.document.getElementById('applicationTabContainer')
      var div = window.document.createElement('div')

      var input = window.document.createElement('input')
      input.type = 'radio';
	  input.checked = false;
      input.className = 'radio';
      input.name = 'screen';
      input.value = id;
      // input.setAttribute("onclick", 'toggle(\''+id+'\')');
      var img = window.document.createElement('img')
      img.src = imgDataURL;
      img.className = 'img';
      var div2 = window.document.createElement('div')
      div2.className = 'border';
      var label = window.document.createElement('label')
      label.innerHTML = name;
      label.style = 'text-overflow: ellipsis; word-break: break-word;';

      div.appendChild(input);
      div.appendChild(img);
      div.appendChild(div2);
      div.appendChild(label);
      screens.appendChild(div);

    }
    console.log(screens)
  refresh();
}
//Get all sources available as window or screens
function showSources() {
  desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {console.log(sources)
    for (let source of sources) {
      console.log("Name: " + source.name);
      addSource(source);
    }
  });
}
async function showSourcesToMain() {
  return await desktopCapturer.getSources({ types:['window', 'screen'] });
  // , function(error, sources) {console.log(sources)
  //   for (let source of sources) {
  //     console.log("Name: " + source.name);
  //     addSource(source);
  //   }
  // });
}



function toggle(id) {console.log('toggle',id);
  if (!desktopSharing) {
    // var id = ($('select').val()).replace(/window|screen/g, function(match) { return match + ":"; });
    onAccessApproved(id);
  } else {
    desktopSharing = false;

    if (localStream)
      localStream.getTracks()[0].stop();
    localStream = null;

    // document.querySelector('button').innerHTML = "Enable Capture";

    // $('select').empty();
    // window.document.getElementById('screens').innerHTML = '';
    // showSources();
    // refresh();
  }
}

async function onAccessApproved(desktop_id) {console.log('onAccessApproved', desktop_id);
  if (!desktop_id) {
    console.log('Desktop Capture access rejected.');
    return;
  }
  desktopSharing = true;
  // document.querySelector('button').innerHTML = "Disable Capture";
  console.log("Desktop sharing started.. desktop_id:" + desktop_id);
  // navigator.webkitGetUserMedia({
  //   audio: false,
  //   video: {
  //     mandatory: {
  //       chromeMediaSource: 'desktop',
  //       chromeMediaSourceId: desktop_id,
  //       minWidth: 1280,
  //       maxWidth: 1280,
  //       minHeight: 720,
  //       maxHeight: 720
  //     }
  //   }
  // }, gotStream, getUserMediaError);
  try {
        // navigator.mediaDevices.getUserMedia({audio: false,
        // video: {
        //   mandatory: {
        //     chromeMediaSource: 'desktop',
        //     chromeMediaSourceId: desktop_id,
        //     minWidth: 1280,
        //     maxWidth: 1280,
        //     minHeight: 720,
        //     maxHeight: 720
        //   }
        // }}).then(streamId => { return streamId;})
        if(key==='sorces1'){

        var media = navigator.mediaDevices.getDisplayMedia({audio: false, video:{cursor:"always"}}).then(function(media){return media;})
    .catch(err => { console.error("Error:" + err); return null; });
    console.log('');
    console.log('-------------');
    console.log(media);
    console.log('-------------');
    console.log('');
    } else {
      navigator.mediaDevices.getDisplayMedia = () => {
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: desktop_id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
              }
            }
          })
          .then(stream => {
			  console.log('---------------------------------');
				console.log('Screen Share --> then Stream');
				console.log('Tracks Length',stream.getVideoTracks().length);
				console.log('---------------------------------');
            stream.getVideoTracks()[0].addEventListener('removetrack', () => {
			//stream.addEventListener('ended', () => {
				console.log('---------------------------------');
				console.log('Screen Share Stopped', 'ended');
				console.log('---------------------------------');
              if (desktopSharing) {
                toggle();
              }
            });
            stream.getVideoTracks()[0].addEventListener('mute', () => {
				console.log('---------------------------------');
				console.log('Screen Share Stopped', 'mute');
				console.log('---------------------------------');
              if (desktopSharing) {
                toggle();
              }
            });
			localStream = stream;
            return stream;
          });
      };
      // const stream = await navigator.mediaDevices.getUserMedia({
      //     audio: false,
      //     video: {
      //         mandatory: {
      //             chromeMediaSource: 'desktop',
      //             chromeMediaSourceId: desktop_id,
      //             minWidth: 1280,
      //             maxWidth: 1280,
      //             minHeight: 720,
      //             maxHeight: 720
      //           }
      //         }
      //       })
            // handleStream(stream)
            // gotStream(stream)
    }
  } catch (e) {
    // handleError(e)
    getUserMediaError(e)
  }
      // return
}
  function gotStream(stream) {
    console.log('gotStream',stream);
    console.log('gotStream',stream.getVideoTracks());
    console.log('gotStream',document.querySelector('video').srcObject);
    localStream = stream;
    // document.querySelector('video').src = window.URL.createObjectURL(stream);
    document.querySelector('video').srcObject = stream;
    stream.onended = function() {
      if (desktopSharing) {
        toggle();
      }
    };
  }

  function getUserMediaError(e) {
    console.log(e)
    console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
  }

  function manageTabs() {
    var entireTab = document.getElementById("entireTab");
    var applicationTab = document.getElementById("applicationTab");
    var entireTabContainer = document.getElementById("entireTabContainer");
    var applicationTabContainer = document.getElementById("applicationTabContainer");
    entireTabContainer.style.display = "flex"
    applicationTabContainer.style.display  = "none";
    entireTab.onclick = function(){
        entireTab.parentElement.className = "active"
        applicationTab.parentElement.className  = "";

        entireTabContainer.style.display = "flex"
        applicationTabContainer.style.display  = "none";
    }
    applicationTab.onclick = function(){
        entireTab.parentElement.className = ""
        applicationTab.parentElement.className  = "active";

        entireTabContainer.style.display = "none"
        applicationTabContainer.style.display  = "flex";

    }
  }