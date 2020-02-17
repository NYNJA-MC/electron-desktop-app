const ipcRendererUpdateWindow = require('electron').ipcRenderer;
console.log(process.versions)
ipcRendererUpdateWindow.on('update', function(event, message) {
  var msgJSON = JSON.parse(message);console.log(message);
  // // message = {key:'',text:''};
  switch (msgJSON.key) {
    case 'update-check':

        //Update UI button or text
        // document.getElementById('update-info').style = '';
        // document.getElementById('update-info').className = 'pure-button-accent';
        document.getElementById('update_latest_version').innerHTML = (msgJSON.upgrade?'A new release is available ('+msgJSON.version+').':(msgJSON.version!==''?'You are using latest version of Nynja.':'Encountered an error while updating, try again later.'));
        document.getElementById('update_current_version').innerHTML = 'version '+msgJSON.currentVersion;
        document.getElementById('update_version_electron').innerHTML = msgJSON.electron;
        document.getElementById('update_version_chromium').innerHTML = msgJSON.chromium;
        document.getElementById('update_version_nodejs').innerHTML = msgJSON.nodejs;

        if(msgJSON.upgrade){
          // document.getElementById('update-install').removeEventListener('click');
          document.getElementById('update_download_install').style = '';
          document.getElementById('update_download_install').addEventListener("click", startDownloading)

        }
        // //Handle event
        // // document.getElementById('update-info').removeEventListener('click');
        // document.getElementById("update-info").addEventListener("click", function(){//alert(1);
        //   //show description windows
        //   document.getElementById('update-desc-box').style = 'margin:25px;padding: 25px;width: 300px;border: 2px solid #ccc;border-radius: 10px;';
        //   document.getElementById('update-desc-current').innerHTML = 'Current Version:    '+msgJSON.currentVersion;
        //   document.getElementById('update-desc-latest').innerHTML = 'Latest Version:    '+msgJSON.version+'\n '+(msgJSON.upgrade?'Upgrade available':'');
        //
        //   if(msgJSON.upgrade){
        //     // document.getElementById('update-install').removeEventListener('click');
        //     document.getElementById('update-install').style = '';
        //     document.getElementById('update-install').addEventListener("click", startDownloading)
        //
        //   }
        // });
      break;
    case 'update-progress':

    // document.getElementById('update-progress-box').style = 'margin:25px;padding: 25px;width: 500px;border: 2px solid #ccc;border-radius: 10px;';
    // document.getElementById('update-progress-percent').innerHTML = msgJSON.percent+'%';
    // document.getElementById('update-progress-complete').innerHTML = 'Total: '+msgJSON.bytesTotal+'     Transfer: '+msgJSON.bytesTransfer+'    speed in bytesPerSec: '+msgJSON.bytesPerSec+'';
    // if(msgJSON.percent>99){
    //   document.getElementById('update-progress-complete').innerHTML = 'Finished download, start installing updates.';
    // }
      break;
    default:

  }
})
function startDownloading(){console.log('start-download')
  //Update confirm and notify main process
  ipcRendererUpdateWindow.send('update-main','update-start-window');
  // document.getElementById('update-desc-box').style = 'display: none;';
  // document.getElementById('update-progress-box').style = 'margin:25px;padding: 25px;width: 300px;border: 2px solid #ccc;border-radius: 10px;';

}
