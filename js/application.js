// wait for phonegap to load

 var loginUrl = 'https://login.salesforce.com/';
 var clientId = '3MVG9rFJvQRVOvk49xUquum.p.12gtyhEumB01SQhP.zZ.LyzAnC_d18vRgl3M1uHDGMSTLJFIDT1B.9d9lnt';
 var redirectUri = 'https://login.salesforce.com/services/oauth2/success';
 var client;
 var geolocationTimer;




client = new forcetk.Client(clientId, loginUrl);

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}


document.addEventListener("deviceready", onDeviceReady, false);

// The device/phonegap is ready
//
function onDeviceReady() {



 loginSF();

}

// onSuccess Geolocation
//

 function onSuccess(position) {
    var message = 'Latitude: '                 + position.coords.latitude              + '<br />' +
                        'Longitude: '          + position.coords.longitude             + '<br />' +
                        'Altitude: '           + position.coords.altitude              + '<br />' +
                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
                        'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                        'Heading: '            + position.coords.heading               + '<br />' +
                        'Speed: '              + position.coords.speed                 + '<br />' +
                        'Timestamp: '          + position.timestamp                    + '<br />';

       newLog(message);
}

// onError Callback receives a PositionError object
//
function onError(error) {
	        alert('code: '    + error.code    + '\n' +
	                'message: ' + error.message + '\n');
}


// Log a message
//

function addLog(message)
{
   var element = document.getElementById('log');
    element.innerHTML +=  message;

}

// Clear Log
function  clearLog()
{
   var element = document.getElementById('log');
    element.innerHTML = '';

}

// Clear Log
function  newLog(message)
{
   clearLog();
   addLog(message);

}

//

function onLocationChange (loc){

  if (loc.startsWith(redirectUri)) {
     ChildBrowser.close();
     sessionCallback(unescape(loc));
 }
}

function loginSF() {


        try
        {
		// alert('SF');

         var cb = ChildBrowser.install();

          ChildBrowser.onLocationChange = onLocationChange;

             ChildBrowser.showWebPage(getAuthorizeUrl(loginUrl, clientId, redirectUri), { showLocationBar: false });
		 }
		 catch(err)
		 {
			 addLog('Exception : ' + err);
		 }
 }
//
function getAuthorizeUrl(loginUrl, clientId, redirectUri){
	    return loginUrl+'services/oauth2/authorize?display=touch'
	        +'&response_type=token&client_id='+escape(clientId)
	        +'&redirect_uri='+escape(redirectUri);
	}

//
function sessionCallback(loc) {
         var oauthResponse = {};

         var fragment = loc.split("#")[1];

         if (fragment) {
             var nvps = fragment.split('&');
             for (var nvp in nvps) {
                 var parts = nvps[nvp].split('=');
                 oauthResponse[parts[0]] = unescape(parts[1]);
             }
         }

         if (typeof oauthResponse === 'undefined'
             || typeof oauthResponse['access_token'] === 'undefined') {
             errorCallback({status: 0,
                           statusText: 'Unauthorized',
                           responseText: 'No OAuth response'
                           });
         } else {
             client.setSessionToken(oauthResponse.access_token, null,
		    	oauthResponse.instance_url);


             startApplication();
		 }
 }



function getGeolocation()
{
	 alert('getGeolocation');
	 navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function stopGetLocationTimer()
{
	clearInterval(geolocationTimer);
}


function startApplication()
{
	 alert('Start Application');
	geolocationTimer= setInterval(function(){getGeolocation()},5*60*1000);

}