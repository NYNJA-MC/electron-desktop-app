// Modules to control application life and create native browser window
const {app, Menu, BrowserWindow,  MenuItem, webFrame, ipcMain} = require('electron');

const PDFWindow = require('electron-pdf-window');
const { autoUpdater } = require("electron-updater");
var fs = require('fs');
var open = require('open');
// var FB = require('fb');
const { dialog } = require('electron');
const { session } = require('electron');
const { request } = require('electron');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let updateWindow;
let selection;
let isMenuUpdate = false;
let local_storage = {};
// const loadURL = 'https://localhost:8080/dashboard';
// const loadURL = 'https://web.nynja.net/dashboard';
// const loadURL = 'https://web.staging.nynja.net/dashboard';
const loadURL = 'https://web.dev.nynja.net/dashboard';
function createWindow() {
	//process.env.GOOGLE_API_KEY = "AIzaSyCPbmxHXnF0DbOltt1xfRZSIJ6hKSpHZvE";
	//process.env.GOOGLE_API_KEY = "AIzaSyCX16OxqGaRTh6tsceFSHfnXSqcH0RPOLA";
	process.env.GOOGLE_API_KEY = "AIzaSyAkYWAfciFhM35qkDKTFaVst3g2xPpOMcU";
	
				console.log('getPath logs',app.getPath('logs'))
	let exePath = app.getPath('exe').toString();
	console.log('exePath.indexOf',exePath.lastIndexOf('\\'));
	console.log(exePath.slice(0,exePath.lastIndexOf('\\')));
	exePath = exePath.slice(0,exePath.lastIndexOf('\\'));
	console.log('exePath',exePath);
	const screen = require('electron').screen;
	const display = screen.getPrimaryDisplay();

	//Read Permission Request
	if(fs.existsSync(exePath + '\\permission.txt')){
		fs.readFile(exePath + '\\permission.txt', function (err, data) {
			if (err) {
				local_storage = {};
				return console.error(err);
			}
			console.log("Permission Data", data);
			local_storage = JSON.parse(data);
			
		});
	}
	let splashWindow = new BrowserWindow({
			width: 400,
			height: 250,
			x: (display.workArea.width-400)/2,
			y: (display.workArea.height-250)/2,
		 alwaysOnTop: true,
		 transparent: true,
		 frame: false,
		 show: false,
			webPreferences: {
					nodeIntegration: true
			}
	});
	splashWindow.loadURL(`file://${__dirname}/splash.html`).then(function (res) {
	//splashWindow.loadURL('https://web.dev.nynja.net/dashboard').then(function (res) {
	// splashWindow.loadURL(app.getAppPath()+'\\splash.html').then(function (res) {

					})
					.catch(function (error) {
							console.log(error.message)

					splashWindow = null;

					});
 splashWindow.show();

console.log(display.workArea);
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: display.workArea.width,
        height: display.workArea.height,
        // x: 262,
        // y: 250,
        minWidth: 1024,
        minHeight: 800,
//        width: 800,
//        height: 800,
       // width: 500,
       // height: 300,
			 show: false,
        webPreferences: {
            nodeIntegration: true,
			plugins: true,
			allowRunningInsecureContent: true
        }
    });
		mainWindow.once('ready-to-show', () => {
				// mainWindow.show()
		})
		//
		let initShow = true;
		// mainWindow.webContents.on('did-finish-load', function () {console.log('did-finish-load')});
		// mainWindow.webContents.on('did-start-loading', function () {console.log('did-start-loading')});
		// mainWindow.webContents.on('did-stop-loading', function () {console.log('did-stop-loading')});
		// mainWindow.webContents.on('dom-ready', function () {console.log('dom-ready')});
		mainWindow.webContents.on('page-title-updated', function (event, title, explicitSet) {
			console.log('');
			console.log('page-title-updated');
			console.log('title', title);
			console.log('');
			if(initShow){console.log('page-title-updated');initShow=false;splashWindow.close();mainWindow.show();}
			
		});
		// mainWindow.webContents.on('page-favicon-updated', function () {console.log('page-favicon-updated')});
		//
//mainWindow.webContents.executeJavaScript('console.log(\''+(app.getAppPath())+'\')').then(function(value){
//                });

    var arguments = process.argv;

    // console.log('arguments : ' + arguments);
    // console.log('');
    // console.log('argument 0 : ' + arguments[0]);
    // console.log('argument 1 : ' + arguments[1]);
    // console.log('argument 2 : ' + arguments[2]);
    // console.log('');
    // console.log('----------------');
    // console.log('');
    //   var arg_index = 1;//for prod
    var arg_index = 2;//for dev
    if (arguments[arg_index] == null || arguments[arg_index] == undefined) {

        console.log('');
        console.log('Showing Default ');
        console.log('');
        console.log('');


          mainWindow.loadURL(loadURL).then(function (res) {
                    console.log(78,res)


                })
                .catch(function (error) {
                    console.log(error.message)
                    fs.writeFile(app.getPath('logs') + '//nynja.log',
                            'date: ' + new Date() + '\n' +
                            'url: ' + arguments[arg_index] + '\n' +
                            'exception: ' + error.message, function (err) {
                                if (err) {
                                    return console.error(err);
                                }
								mainWindow = null;
								app.quit();
                            });
                });

    } else {
			fs.writeFile(app.getPath('logs')+'//check.log',
							'date: ' + new Date() + '    -  \n' +
							'  url: ' + arguments[arg_index], function (err) {
									if (err) {
											return console.error(err);
									}
	// mainWindow = null;
	// app.quit();
							});
        console.log('');
        console.log('Showing arg ' + arguments[arg_index]);
        console.log('');
		mainWindow.loadURL(loadURL).then(function (res) {
			console.log(111,res)

                })
                .catch(function (error) {
                    console.log(error.message)
//                    fs.writeFile(app.getAppPath() + '//nynja.log',
                    fs.writeFile(app.getPath('logs')+'\\nynja.log',
                            'date: ' + new Date() + '\n'  +
                            'url: ' + arguments[arg_index] + '\n' +
                            'exception: ' + error.message, function (err) {
                                if (err) {
                                    return console.error(err);
                                }
								mainWindow = null;
								app.quit();
                            });
                });
    }
//    switch (arguments.length) {
//        case 1:
//            mainWindow.loadURL('https://web.nynja.net')
//            break;
//        case 2:
//            mainWindow.loadURL(arguments[1])
//            break;
//        default:
//            mainWindow.loadFile('index.html')
//            break;
//    }
//    mainWindow.loadURL('https://web.nynja.net')
//    mainWindow.loadURL('https://dev.farmsleaf0.com/farmsLeaf')
//    mainWindow.loadURL('file://G://TECORE//2019//electron//testqs//electron-quick-start//index.html')
    
	// Handle load pae failed.
    mainWindow.webContents.on('did-fail-load', function (e, errorCode, errorDescription, validatedURL,
							isMainFrame, frameProcessId, frameRoutingId) {
		console.log('');
        console.log('mainWindow.webContents.on','did-fail-load');
		console.log('#refer','https://cs.chromium.org/chromium/src/net/base/net_error_list.h');
        console.log('validatedURL',validatedURL);
        console.log('errorDescription',errorDescription);
        console.log('errorCode',errorCode);
		console.log('isMainFrame',isMainFrame);
		console.log('frameProcessId',frameProcessId);
		console.log('frameRoutingId',frameRoutingId);
		console.log('error',e);
		console.log('');
		if(validatedURL.indexOf('https://view.officeapps.live.com')>=0){
			return;
		}
		if(errorDescription==='ERR_CONNECTION_REFUSED'){
			//show error
		}
		if(errorDescription==='ERR_TIMED_OUT'){
			//show error
		}
        // Asynchronous read
        fs.appendFile(app.getPath('logs')+'\\nynja.log',
                'date: ' + new Date() + '\n' +
                'url: ' + validatedURL + '\n' +
                'errorCode: ' + errorCode+ '\n' +
                'exception: ' + errorDescription, function (err) {
                    if (err) {
                        return console.error(err);
                    }

								mainWindow = null;
								app.quit();
                });
    });

    // Emitted when the navigation finished.
    mainWindow.webContents.on('did-navigate', function (event, url) {
			console.log(166,'did-navigate: '+url);
			console.log(exePath + '\\session.txt', fs.existsSync(exePath + '\\session.txt'))
        // Asynchronous read
				// fs.existsSync(app.getAppPath() + '\\session.txt',function(isExist){console.log(168,'isExist');console.log(app.getAppPath() + '\\session.txt',isExist)
				console.log('')
				console.log('getAppPath',app.getAppPath())
				console.log('getPath exe',app.getPath('exe'))
				console.log('getPath temp',app.getPath('temp'))
				console.log('getPath userData',app.getPath('userData'))
				console.log('getPath appData',app.getPath('appData'))
				console.log('getPath logs',app.getPath('logs'))
				console.log('')
					if(fs.existsSync(exePath + '\\session.txt')){
        fs.readFile(exePath + '\\session.txt', function (err, data) {
            if (err) {
                return console.error(err);
            }
						console.log('')
						console.log('Data Read:',data);
						console.log('')
            var sessionVal = {};
            try {
                sessionVal = JSON.parse(data.toString());

                mainWindow.webContents.executeJavaScript('sessionStorage.setItem(\'auth_client_id\',\'' + sessionVal.auth_client_id + '\')').then(function (value) {

                    mainWindow.webContents.executeJavaScript('sessionStorage.setItem(\'auth_token\',\'' + sessionVal.auth_token + '\')').then(function (value) {

                        mainWindow.webContents.executeJavaScript('sessionStorage.setItem(\'dev_key\',\'' + sessionVal.dev_key + '\')').then(function (value) {
//mainWindow.webContents.executeJavaScript('sessionStorage.setItem(\'dev_key0\',\''+(new Date()).getTime()+'\')').then(function(value){
//                });
                        });
                    });
                });
            } catch (e) {
							mainWindow.webContents.executeJavaScript('sessionStorage.clear()').then(function (value) {
                //console.log(e)
							});
            }
            console.log("Asynchronous read: " + data.toString());
        });
			}else{

					mainWindow.webContents.executeJavaScript('sessionStorage.clear()').then(function (value) {
						console.log('Session.txt not found!');
					});
			}
        // });
    });

    // Emitted when the navigation will start.
    mainWindow.webContents.on('will-redirect', function (event, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
		console.log('');
		console.log('will-redirect','URL', url);
		console.log('');
        
	});	
	// Emitted when the navigation started.
    mainWindow.webContents.on('did-start-navigation', function (event, url) {
		console.log('');
		console.log('did-start-navigation','URL', url);
		console.log('');
		if(initShow){
			console.log('page-title-updated');initShow=false;splashWindow.close();mainWindow.show(); 
			//Updateing existing menu items
		//	createApplicationMenu();
			}
		//if (url === 'https://web.nynja.net' || url === 'https://web.nynja.net/'){
		//	event.preventDefault();
		//	mainWindow.loadURL('https://web.nynja.net/auth/phone').then(function (res) {
		//			
		//	}).catch(function (error) {
        //            console.log(error.message)
        //            fs.writeFile(app.getPath('logs') + '//nynja.log',
        //                    'date: ' + new Date() + '\n' +
        //                    'url: https://web.nynja.net/auth/phone \n' +
        //                    'exception: ' + error.message, function (err) {
        //                        if (err) {
        //                            return console.error(err);
        //                        }
		//						mainWindow = null;
		//						app.quit();
        //                    });
        //        });
		//		return;
		//}
        if (url === 'https://web.nynja.net/dashboard' || url === 'https://web.staging.nynja.net/dashboard' || url === 'https://web.dev.nynja.net/dashboard') {
			//|| url === 'https://web.nynja.net/auth/phone' || url === 'https://web.staging.nynja.net/auth/phone' || url === 'https://web.dev.nynja.net/auth/phone') {
            const sessionVals = {'auth_client_id': '', 'auth_token': '', 'dev_key': ''};
            mainWindow.webContents.executeJavaScript('sessionStorage.getItem(\'auth_client_id\')').then(function (value) {
                sessionVals.auth_client_id = value;
                mainWindow.webContents.executeJavaScript('sessionStorage.getItem(\'auth_token\')').then(function (value) {
                    sessionVals.auth_token = value;
                    mainWindow.webContents.executeJavaScript('sessionStorage.getItem(\'dev_key\')').then(function (value) {
                        sessionVals.dev_key = value;//app.getAppPath()
												mainWindow.webContents.executeJavaScript('window.location = "https://mail.google.com/mail/u/0/?logout&hl=en').then(function (value) {});
												// fs.existsSync(app.getAppPath() + '\\session.txt',function(isExist){
													if(fs.existsSync(exePath + '\\session.txt')){

														fs.writeFile(exePath + '\\session.txt', JSON.stringify(sessionVals), function (err) {
															if (err)
																throw err;
															console.log('Saved! overwrite');
														});
													}else{
														fs.appendFile( exePath+'\\session.txt', JSON.stringify(sessionVals), function (err) {
															if (err)
																throw err;
															console.log('Saved! create append');
														});

													}

											// });
                    });
                });
            });
				// }else if(url === 'https://web.nynja.net/'){
				// 	console.log('')
				// 	console.log(url,'https://web.nynja.net/')
				// 	console.log('')
				// 	// exePath = app.getAppPath();
				// 	if(fs.existsSync(exePath + '\\session.txt')){
				// 		console.log('Unlink Path',exePath + '\\session.txt')
				// 		console.log('')
				// 		fs.unlink(exePath + '\\session.txt', (err) => {
				// 		  if (err) {
				// 		    console.error(err)
				// 		    return
				// 		  }
				//
				// 			console.log('Removed File:',exePath+'\\session.txt'+'')
				// 			console.log('')
				// 		  //file removed
				// 		});
				// 		// console.log('rmdir',exePath + '\\session')
				// 		// fs.remove(exePath + '\\session').then(() => {
				// 		// // fs.rmdir(app.getPath('userData')).then(() => {
				// 		//   //done
				// 		// 	console.log('Removed Dir:',app.getPath('userData')+'')
				// 		// 	console.log('')
				// 		// }).catch(err => {
				// 		//   console.error(err)
				// 		// })
				// 		mainWindow.webContents.executeJavaScript('sessionStorage.clear()').then(function (value) {
				// 			console.log(e)
				// 		});
				// 	}else{
				//
				// 	}
        }
    });

    // Emitted when the new window is open.
    mainWindow.webContents.on('new-window', function (event, url) {
			console.log('')
			console.log('new-window',url)
			console.log('')
			console.log('indexOf https://www.facebook.com',url.indexOf('https://www.facebook.com'))
			console.log('indexOf https://www.facebook.com',url.indexOf('https://www.facebook.com')<0)
			console.log('indexOf https://accounts.google.com',url.indexOf('https://accounts.google.com'))
			console.log('indexOf https://accounts.google.com',url.indexOf('https://accounts.google.com')<0)
			console.log('')
			if(url.indexOf('https://accounts.google.com')<0 &&	 url.indexOf('https://www.facebook.com')<0 ){
				console.log(url)
				event.preventDefault();
				open(url);
			}
			if(url.indexOf('https://www.facebook.com')>=0 ){
				// event.preventDefault();
				console.log(url)

				// var options = {
				// 	client_id: '246310162765387',
				// 	scopes: "public_profile",
				// 	redirect_uri: "https://www.facebook.com/connect/login_success.html"
				// };
				// var authWindow = new BrowserWindow({ width: 450, height: 300, show: false,
				// 	parent: mainWindow, modal: true, webPreferences: {nodeIntegration:false} });
				// var facebookAuthURL = "https://www.facebook.com/v2.8/dialog/oauth?client_id=" + options.client_id + "&redirect_uri=" + options.redirect_uri + "&response_type=token,granted_scopes&scope=" + options.scopes + "&display=popup";
				// facebookAuthURL = "https://www.facebook.com/v3.3/dialog/oauth?client_id=276641389634095&redirect_uri=https://web.nynja.net/oauth/facebook/index.html&response_type=code&state=123abc&display=popup";
				// console.log(facebookAuthURL)
				// authWindow.loadURL(facebookAuthURL);
				// authWindow.show();
				// authWindow.webContents.on('will-redirect', function (event, newUrl) {
				// // authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
				// 	// console.log('old',oldUrl);
				// 	var raw_code = (newUrl) || null;
				// 	// var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
				// 	var access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
				// 	var error = /\?error=(.+)$/.exec(newUrl);
				// 	console.log('\nnew',newUrl);
				//
				// 	console.log('\n raw_code',raw_code);
				// 	console.log('\n access_token',access_token);
				// 	console.log('\n error',error);
				//
				// 	if(access_token) {
				//
				//
				// 		FB.setAccessToken(access_token);
				// 		FB.api('/me', { fields: ['id', 'name', 'picture.width(800).height(800)'] }, function (res) {
				// 			console.log(res)
				// 			// mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-name\").innerHTML = \" Name: " + res.name + "\"");
				// 			// mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-id\").innerHTML = \" ID: " + res.id + "\"");
				// 			// mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-pp\").src = \"" + res.picture.data.url + "\"");
				// 		});
				// 		authWindow.close();
				// 	}
				// });
			}
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
		//// //Updateing existing menu items
		createApplicationMenu();
		// var menu = Menu.getApplicationMenu();
		// console.log(menu.items)
		// console.log(menu.items.length)
		// console.log(menu.items[4].submenu.items)
		// console.log(menu.items[4].submenu.items.length)
		// var menuItem = new MenuItem({role:'help',label:'Help',submenu:[{label: 'About us'},{label: 'Check for updates'}]});
		// // menu.append(menuItem);
		// menu.items[4].submenu.items[0].label = 'About us';// = [{label: 'About us'},{label: 'Check for updates'}];
		// Menu.setApplicationMenu(menu);

    console.log('Checking current version');
    console.log('Current Version:'+autoUpdater.currentVersion.version);
    sendStatusToWindow('version.'+autoUpdater.currentVersion.version);
    // Auto start checking for updates on app startup.
    // autoUpdater.setFeedURL('https://api.github.com/repos/akashsuthar/nyn-pub-test/releases/latest');
    autoUpdater.setFeedURL({//url:'https://api.github.com/repos/akashsuthar/nyn-aka-test/releases/latest',
        token:'5e4a74a5e8289226182094d6b3bd45554a3e86af',//GH_TOKEN=5e4a74a5e8289226182094d6b3bd45554a3e86af npm run to push on git
        owner:'NYNJA-MC',
        repo:'electron-desktop-app',
    provider:'github'});
    // sendStatusToWindow({
    // autoUpdater.setFeedURL({
    // //     token:'ba0d5fc941fbd1232680ae758fcd88f72ac27f81',
    //     token:'549ec1ad13c282dca4e3420e26d174c2703b4ca2',
    //     owner:'akashsuthar',
    //     repo:'nyn-pub-test',
    // provider:'github'});
console.log('-')
    // autoUpdater.autoDownload = false;
	// autoUpdater.autoRestart = true;
    // autoUpdater.checkForUpdates();
	//initShow=false;splashWindow.close();mainWindow.show();

    //handles message from renderer process
    ipcMain.on('update-main', function(event, text) {
			console.log(334,text);
      switch (text) {
        case 'update-start':
                console.log('start downloading');
                autoUpdater.downloadUpdate();
          break;
        case 'update-start-window':
                console.log('start downloading window ');
								updateWindow.close();
                autoUpdater.downloadUpdate();
          break;
        default:

      }

    });
	//handles message from renderer process
    ipcMain.on('electron-open-pdf', function(event, text) {
		console.log('');
		console.log('ipcMain.on','electron-open-pdf');
		console.log('data', text);
		console.log('data.url', text.url);
		console.log('');
		openPdf(text.url);
    });
    // //handles message from renderer process for screen share
    // ipcMain.on('screen-share-main', function(event, text) {
		// 	console.log('ipcMain.on(screen-share-main -->',text);
		//
    //   // switch (text) {
    //   //   case 'update-start':
    //   //           console.log('start downloading');
    //   //           autoUpdater.downloadUpdate();
    //   //     break;
    //   //   case 'update-start-window':
    //   //           console.log('start downloading window ');
		// 	// 					updateWindow.close();
    //   //           autoUpdater.downloadUpdate();
    //   //     break;
    //   //   default:
		// 	//
    //   // }
		//
    // });
// console.log('session.fromPartition')
	session.fromPartition('').setPermissionRequestHandler((webContents, permission, callback, details) => {
		console.log('')
		console.log('----------------------------------------')
		console.log(new Date())
		console.log('PermissionRequestHandler >  permission',permission)
		console.log('PermissionRequestHandler >  details',details)
		
		if ( permission === 'notifications') {
			console.log('PermissionRequestHandler > notifications: allowed');
			return callback(true) // allowed.
		}
		if ( permission === 'openExternal' || permission === 'fullscreen') {
			console.log('PermissionRequestHandler > openExternal || fullscreen : allowed');
			return callback(true) // allowed.
		}
		var media_types = (details.mediaTypes===undefined?[]:details.mediaTypes);
		
		console.log('PermissionRequestHandler >  details.mediaTypes',media_types);
		console.log('PermissionRequestHandler >  media_types [local var]',media_types);
		console.log('PermissionRequestHandler >  local_storage',local_storage);
		
		if(media_types.length===0 && details.mediaTypes !== undefined){
			console.log('PermissionRequestHandler >  media_types [local var] EMPTY && ','details.mediaTypes NOT UNDEFINED');
			
			if(details.mediaTypes.length===0){
				console.log('PermissionRequestHandler >  media_types [local var] EMPTY');
				console.log('PermissionRequestHandler >  SHARE SCREEN [permission]');
				console.log(new Date(),'PermissionRequestHandler >  Sending message to desktop_capturer.js to open screen popup');
					mainWindow.webContents.send('share-screen', JSON.stringify({key:'sources3'}));
				
				console.log(new Date(),'PermissionRequestHandler > SHARE SCREEN: allowed');
				console.log('');
				console.log('');
				console.log('');
				console.log('');
				console.log('');
				console.log('');
				return callback(true); // allowed.
			}
		}
		// mainWindow.webContents.send('share-screen', JSON.stringify({key:'sources'}));
		// console.log('media check not geolocation and media type empty');
		if(media_types.length===0 && permission !== 'geolocation'){
			console.log('PermissionRequestHandler > media_types [local var] EMPTY && ',' permission: NOT geolocation');
			console.log('PermissionRequestHandler > denied');
			return callback(false); // denied.
		}
		if(media_types.length===1 && local_storage[permission+media_types[0]] === 1){
			console.log('PermissionRequestHandler > media_types [local var] LENGTH IS 1 && ',' local_storage: '+permission+media_types[0]+' IS 1');
			console.log('PermissionRequestHandler > allowed {audio-call}');
			return callback(true);
		}
		
		if(media_types.length===2 && local_storage[permission+media_types[0]] === 1 && local_storage[permission+media_types[1]] === 1){
			console.log('PermissionRequestHandler > media_types [local var] LENGTH IS 2 && ',' local_storage: '+permission+media_types[0]+' IS 1  && ',' local_storage: '+permission+media_types[1]+' IS 1');
			console.log('PermissionRequestHandler > allowed {video-call}');
			return callback(true);
		}

		if (permission === 'geolocation' && local_storage[permission]!==undefined){
			console.log('PermissionRequestHandler > permission IS geolocation && ',' local_storage: '+permission+' IS NOT UNDEFINED');
			
			if(local_storage[permission]===1){
				console.log('PermissionRequestHandler > local_storage: '+permission+' IS 1');
				console.log('PermissionRequestHandler > geolocation: allowed ');
				return callback(true);
			}else{
				console.log('PermissionRequestHandler > geolocation: denied {unhandled} ');
				
			}
		}
		
		if (permission === 'geolocation') {
			console.log('PermissionRequestHandler > geolocation : dialog ask user');
			dialog.showMessageBox(null,{
				type: "question",
				buttons: ["Block","Allow"],
				defaultId: 1,
				cancelId: 0,
				title: "Permission",
				message: "Nynja application wants to use your geolocation"
			},(response)=>{
				console.log('PermissionRequestHandler > geolocation : dialog > response: ', response);
				if(response === 1){
					local_storage[permission] = 1;
					writePermission(exePath);
					console.log('PermissionRequestHandler > geolocation : allowed ');
					return callback(true);
				}else{
					local_storage[permission] = 0;
					writePermission(exePath);
					console.log('PermissionRequestHandler > geolocation : denied ');
					return callback(false);
				}
			});
		}
		
		if (permission === 'media') {
			console.log('PermissionRequestHandler > media [audio|video] : dialog ask user');
			dialog.showMessageBox(null,{
				type: "question",
				buttons: ["Block","Allow"],
				defaultId: 1,
				cancelId: 0,
				title: "Permission",
				message: "Nynja application wants to use your "+
				(media_types.length===1?
					(media_types[0]==="video"?
					"camera":
					(media_types[0]==="audio"?
					"microphone":
					"media")):
					(media_types.length===2?
						(media_types[0]==="video" && media_types[1]==="audio"?
						"camera and microphone":
						(media_types[1]==="video" && media_types[0]==="audio"?
						"microphone and camera":
						"media")):"media"))
					},(response)=>{
						console.log('PermissionRequestHandler > media : dialog > response: ', response);
						if(response === 1){
							if(media_types.length===1){
								local_storage[permission+media_types[0]]=1;
							}else if(media_types.length===2){
								local_storage[permission+media_types[0]]=1;
								local_storage[permission+media_types[1]]=1;
								
							}
							writePermission(exePath);
							console.log('PermissionRequestHandler > geolocation : allowed ');
							return callback(true);
							
					}else{
						
						if(media_types.length===1){
							local_storage[permission+media_types[0]]=0;
						}else if(media_types.length===2){
							local_storage[permission+media_types[0]]=0;
							local_storage[permission+media_types[1]]=0;
							
						}
						
						writePermission(exePath);
						console.log('PermissionRequestHandler > geolocation : denied ');
						return callback(false);
					}
				});
		  }
	});
		session.fromPartition('').setPermissionCheckHandler((webContents, permission) => {
			console.log('chk webContents.getURL()',webContents.getURL())
			console.log('chk permission',permission)
		  // if (permission === 'notifications') {
		  //   return false // denied
		  // }
		  // if (permission === 'media') {
		  //   return false // denied
		  // }
			//
		  // return true
		});
		// request.on('login',(authInfo, callback) => {
		// 	console.log('')
		// 	console.log('---------------------------------')
		// 	console.log('request > on > login')
		// 	console.log('authInfo', authInfo)
		// 	console.log('---------------------------------')
		// 	console.log('')
		// 	callback('nynja','nynja2018');
		// });
		// session.defaultSession.allowNTLMCredentialsForDomains("*")
		app.on('login',(event, webContents, request, authInfo, callback) => {
				console.log('')
				console.log('---------------------------------')
				console.log('app > on > login')
				console.log('authInfo', authInfo)
				console.log('---------------------------------')
				console.log('');
				event.preventDefault();
				callback('nynja','nynja2018');
			});

}

// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
	// On certificate error we disable default behaviour (stop loading the page)
	// and we then say "it is all fine - true" to the callback
	event.preventDefault();
	callback(true);
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// New Window Opened.
app.on('browser-window-created', function (event) {
    console.log("browser-window-created")
})
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
        createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Auto update code.
autoUpdater.on('checking-for-update', () => {
  // fs.appendFile('nynja-auto_update.log',
  //         'checking-for-update' , function (err) {
  //             if (err) {
  //                 return console.error(err);
  //             }
  //
  //           });
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
	if(isMenuUpdate){
		const screen = require('electron').screen
	    const display = screen.getPrimaryDisplay()
			updateWindow = new BrowserWindow({
	        width: display.workArea.width*0.27,
	        height: display.workArea.height*0.40,
					center:true,titleBarStyle:'hidden',fullscreen:false,fullscreenable:false,resizable:false,maximizable:false,
					webPreferences: {
	             nodeIntegration: true
	         }});
			updateWindow.loadURL(`file://${__dirname}/check_update.html`).then(function (res) {
				sendUpdateStatusToWindowCheck(JSON.stringify({key:'update-check', upgrade:true, version:info.version, electron: process.versions.electron, chromium: process.versions.chrome, nodejs: process.versions.node, currentVersion:autoUpdater.currentVersion.version,status: 200}));
			});
			updateWindow.setMenuBarVisibility(false);
			updateWindow.show();
	}else{
  // fs.appendFile('nynja-auto_update.log',
  //         'update-available' , function (err) {
  //             if (err) {
  //                 return console.error(err);
  //             }
  //
  //           });

  sendUpdateStatusToWindow(JSON.stringify({key:'update-check', upgrade:true, version:info.version, currentVersion:autoUpdater.currentVersion.version,status: 200}));
}
  //sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
	console.log('update-not-available','info')
	if(isMenuUpdate){
		const screen = require('electron').screen
	    const display = screen.getPrimaryDisplay()
		console.log(`${__dirname}/check_update.html`)
		console.log('>>>>>>>')
		console.log(process.versions.node)
		console.log(process.versions.chrome)
		console.log(process.versions.electron)
		console.log('>>>>>>>')
		updateWindow = new BrowserWindow({
        width: display.workArea.width*0.27,
        height: display.workArea.height*0.40,
				parent: mainWindow,
				center:true,titleBarStyle:'hidden',fullscreen:false,fullscreenable:false,resizable:false,maximizable:false,
				webPreferences: {
             nodeIntegration: true
         }});
		updateWindow.loadURL(`file://${__dirname}/check_update.html`).then(function (res) {
			console.log('success')
			sendUpdateStatusToWindowCheck(JSON.stringify({key:'update-check', upgrade:false, version:info.version, electron: process.versions.electron, chromium: process.versions.chrome, nodejs: process.versions.node,currentVersion:autoUpdater.currentVersion.version, status: 400}));
		});
		updateWindow.setMenuBarVisibility(false);
		updateWindow.show();
		updateWindow.on('page-title-updated',function(){
			console.log('page-title-updated')

	})
	}else{
  // fs.appendFile('nynja-auto_update.log',
  //         'update-not-available' , function (err) {
  //             if (err) {
  //                 return console.error(err);
  //             }
  //
  //           });
  sendUpdateStatusToWindow(JSON.stringify({key:'update-check', upgrade:false, version:info.version, currentVersion:autoUpdater.currentVersion.version, status: 400}));
  //sendStatusToWindow('Update not available.');
}
})
autoUpdater.on('error', (err) => {
	console.log('[AutoUpdater] event > error ');
	console.log(err)
	console.log('err:'+err.message)
	if(isMenuUpdate){
		const screen = require('electron').screen
			const display = screen.getPrimaryDisplay()
			updateWindow = new BrowserWindow({
					width: display.workArea.width*0.27,
					height: display.workArea.height*0.40,
					center:true,titleBarStyle:'hidden',fullscreen:false,fullscreenable:false,resizable:false,maximizable:false,
					webPreferences: {
	             nodeIntegration: true
	         }});
			updateWindow.loadURL(`file://${__dirname}/check_update.html`).then(function (res) {
				sendUpdateStatusToWindowCheck(JSON.stringify({key:'update-check', upgrade:false, version:'', electron: process.versions.electron, chromium: process.versions.chrome, nodejs: process.versions.node, status: 400, currentVersion:autoUpdater.currentVersion.version, message: err.message}));

			});
			updateWindow.setMenuBarVisibility(false);
			updateWindow.show();
	}else{
  // fs.appendFile('nynja-auto_update.log',
  //         'error' , function (err) {
  //             if (err) {
  //                 return console.error(err);
  //             }
  //
  //           });

  sendUpdateStatusToWindow(JSON.stringify({key:'update-check', upgrade:false, version:'', status: 400, currentVersion:autoUpdater.currentVersion.version, message: err.message}));
  //sendStatusToWindow('Error in auto-updater. ' + err);
}
})
autoUpdater.on('download-progress', (progressObj) => {
	if(mainWindow!=null){
		if(isMenuUpdate){

			console.log(Math.round(progressObj.percent*100)/100);
			mainWindow.setProgressBar(Math.round(progressObj.percent*100)/10000);
		}else{

	// fs.appendFile('nynja-auto_update.log',
	//         ' downlaod-progress' , function (err) {
	//             if (err) {
	//                 return console.error(err);
	//             }
	//
	//           });

	// let log_message = "Download speed: " + progressObj.bytesPerSecond;
	// log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
	// log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
		mainWindow.setProgressBar(Math.round(progressObj.percent*100)/10000);
	//sendUpdateStatusToWindow(JSON.stringify({key:'update-progress', percent:Math.round(progressObj.percent*100)/100, bytesPerSec:progressObj.bytesPerSecond, status: 200, bytesTransfer:progressObj.transferred, bytesTotal: progressObj.total}));
	//  sendStatusToWindow(log_message);
		}
	}
});
autoUpdater.on('update-downloaded', (info) => {
  // fs.appendFile('nynja-auto_update.log',
  //         ' update-downloaded' , function (err) {
  //             if (err) {
  //                 return console.error(err);
  //             }
  //
  //           });

  sendStatusToWindow('Update downloaded');
  //setImmediate(function() {
	//  console.log(autoUpdater)
	  
    //mainWindow.setClosable(true);
  //    autoUpdater.quitAndInstall(false,true);
  //});
  setImmediate(() => {
  app.removeAllListeners("window-all-closed")
  if (mainWindow != null) {
    mainWindow.close()
  }
  //app.relaunch(process.execPath);
  autoUpdater.quitAndInstall(false,true);
  
})
});

function sendStatusToWindow(text) {
 // log.info(text);//DEBUG=electron-builder CSC_NAME="Nynja, Inc. (9GKQ5AMF2B)" CSC_LINK=build/CertificatesDeveloperId.p12 GH_TOKEN=5e4a74a5e8289226182094d6b3bd45554a3e86af npm run ship --> mac command
  console.log(text)
  mainWindow.webContents.send('message', text);
}

function sendUpdateStatusToWindowCheck(text) {
	console.log(text)
  updateWindow.webContents.send('update', text);
}
function sendUpdateStatusToWindow(text) {
  mainWindow.webContents.send('update', text);
}
function createApplicationMenu() {
	const template = [
  // { role: 'appMenu' }
  ...(process.platform === 'darwin' ? [{
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
       { 
          label: 'Print' ,
          click:  () => {
                   console.log('printing')
                const options = { silent: false, background: true};
                mainWindow.webContents.print(options, (success, errorType) => {
                  console.log(success);
				  console.log(errorType);
				  if (!success) console.log(errorType)
                })
          }
	  },
	  { role: 'quit' }
      // isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      // ...(isMac ? [
      //   { role: 'pasteAndMatchStyle' },
      //   { role: 'delete' },
      //   { role: 'selectAll' },
      //   { type: 'separator' },
      //   {
      //     label: 'Speech',
      //     submenu: [
      //       { role: 'startspeaking' },
      //       { role: 'stopspeaking' }
      //     ]
      //   }
      // ] : [
      //   { role: 'delete' },
      //   { type: 'separator' },
      //   { role: 'selectAll' }
      // ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      //{ role: 'resetzoom' },
      //{ role: 'zoomin' },
      //{ role: 'zoomout' },
      //{ type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      // ...(isMac ? [
      //   { type: 'separator' },
      //   { role: 'front' },
      //   { type: 'separator' },
      //   { role: 'window' }
      // ] : [
      //   { role: 'close' }
      // ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Check for updates',
        click () { checkUpdatesMenu(); }
      }, {
        label: 'About NYNJA',
        click () { require('electron').shell.openExternalSync('https://nynja.io') }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
}

function checkUpdatesMenu(){
	isMenuUpdate = true;
	autoUpdater.checkForUpdates();
}
function writePermission(exePath){
	console.log("Write Permission > isExists", fs.existsSync(exePath + '\\permission.txt'))
	if(fs.existsSync(exePath + '\\permission.txt')){
		console.log("Write Permission","Write");		
		fs.writeFile(exePath + '\\permission.txt', JSON.stringify(local_storage), function (err) {
			if (err)
				throw err;
			
			console.log('Saved! Permission:OW',JSON.stringify(local_storage));
		});
	}else{
		console.log("Write Permission","Append")
		fs.appendFile( exePath+'\\permission.txt', JSON.stringify(local_storage), function (err) {
			if (err)
				throw err;
			
			console.log('Saved! Permission:AP',JSON.stringify(local_storage));
		});

	}
}
function openPdf(url){
	console.log('');
	console.log('openPdf',url);
	console.log('');
	var mainWin_pos = mainWindow.getPosition();
	var mainWin_size = mainWindow.getSize();
	
    //minWidth: 1024 w-800 /2
    //minHeight: 800
	console.log('mainWin_pos',mainWin_pos);
	console.log('mainWin_size',mainWin_size);
	console.log('x',parseInt(mainWin_pos[0])+parseInt((mainWin_size[0]-800)/2));
	console.log('y',parseInt(mainWin_pos[1])+parseInt((mainWin_size[1]-600)/2));
	const win_pdf = new BrowserWindow({
		width: 800,
		height: 600,
		x: parseInt(mainWin_pos[0])+parseInt((mainWin_size[0]-800)/2),
		y: parseInt(mainWin_pos[1])+parseInt((mainWin_size[1]-600)/2),
		frame: false,
		parent: mainWindow,
		modal: true,
        //webPreferences: {
        //    nodeIntegration: true
		//}
	});
	
	const win_pdfClose = new BrowserWindow({
		width: 800,
		height: 55,
		x: win_pdf.getPosition()[0],
		y: win_pdf.getPosition()[1]+601,
		frame: false,
		parent: mainWindow,
		modal: true,
		transparent: true,
        webPreferences: {
            nodeIntegration: true
		}
	});
	win_pdfClose.loadURL(`file://${__dirname}/pdf_close.html`);
	/*var focus_count = 0;
	win_pdf.on('focus',function(a,b){
		console.log('focus',a,b);focus_count++;
		if(focus_count===3){
			focus_count = 0;
			//win_pdf.loadURL(url);
		}
	});
	win_pdf.on('blur',function(a,b){console.log('blur',a,b)});*/
	PDFWindow.addSupport(win_pdf);
	win_pdf.loadURL(url);
	//devToolsWebContents
	console.log('win_pdf',win_pdf);/*.then(function (res) {
		console.log('');
		console.log('win_pdf loadURL','success');						
		console.log(res);

	})
	.catch(function (error) {
		console.log('');
		console.log('win_pdf loadURL','error');						
		console.log(error.message);
		console.log(error);
		console.log('');
	});*/
	
}
function printMenuAction(){
                         console.log('');
                         console.log('printMenuAction');
                         console.log('');
/*                         mainWindow.webContents.printToPDF({}, (error, data) => {
                                                           if (error) throw error
                                                           fs.writeFile('print.pdf', data, (error) => {
                                                                        if (error) throw error
                                                                        console.log('Write PDF successfully.')
                                                                        })
                                                           })*/
                         var get_printers = mainWindow.webContents.getPrinters()
                         console.log('Get Printers',get_printers);
                         if(get_printers.length===0){
                         //alert('No Device Found');
                         dialog.showErrorBox('Print', 'No Device Found.');
						 }else{
							 var is_found = false;
						 
							 for(var p = 0;p<get_printers.length;p++){
								 console.log('');
								 console.log('Name:',get_printers[p].name);
								 console.log('isDefault:',get_printers[p].isDefault);
								 console.log('');
								 if(get_printers[p].isDefault){is_found= true;
									 console.log('Default Printer:', get_printers[p].name);
									const options = {silent: false, printBackground: true, deviceName: get_printers[p].name}
									 //const options = {silent: true, printBackground: true};
									 mainWindow.webContents.print(options,(success, failureReason) => {
                                                      console.log('success',success)
                                                      if(!success) console.log('failureReason',failureReason)
														  
													  dialog.showMessageBox(null,{
															type: "info",
															buttons: [],
															defaultId: 1,
															title: "Print",
															message: "Printing finished."
														},(response)=>{console.log(typeof response, response)
															
														});
					// 	}
                                                      });
								 }
								 if((p+1)===get_printers.length && !is_found){
									 
									dialog.showErrorBox('Print', 'No Default Device Found.');
								 }
							  }
						 }
}