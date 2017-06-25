const functions = require('firebase-functions');
var MetaInspector = require('node-metainspector');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.getlinkmetadata = functions.database.ref('/links/{pushId}/link')
	.onWrite(event => {
	// Grab the current value of what was written to the Realtime Database.
	const url = event.data.val();
	var client = new MetaInspector(url, { timeout: 10000 });
	client.on("fetch", function(){
		if (client.ogTitle) {
			event.data.ref.parent.child('title').set(client.ogTitle);
		}
		else if (client.title) {
			event.data.ref.parent.child('title').set(client.title);
		}
		else {
			event.data.ref.parent.child('title').set("No Page Title Found");
		}
		if (client.ogDescription) {
			event.data.ref.parent.child('description').set(client.ogDescription);
		}
		else if (client.description) {
			event.data.ref.parent.child('description').set(client.description);
		}
		else {
			event.data.ref.parent.child('description').set("No Description Found");
		}
		if (client.image) {
			event.data.ref.parent.child('image').set(client.image);
		}
		else {
			event.data.ref.parent.child('image').set("http://www.worldbank.org/content/dam/wbr/previewnotavailable.gif");
		}
	});
	client.on("error", function(err) {
		if(!err) {
			event.data.ref.parent.child('title').set("No Page Title Found");
			event.data.ref.parent.child('description').set("No Description Found");
			event.data.ref.parent.child('image').set("http://www.worldbank.org/content/dam/wbr/previewnotavailable.gif");
		}
	});
	client.fetch();
	//console.log('Uppercasing', event.params.pushId, url);
	// You must return a Promise when performing asynchronous tasks inside a Functions such as
	// writing to the Firebase Realtime Database.
	// Setting an "uppercase" sibling in the Realtime Database returns a Promise.
	var d = (new Date()).toGMTString();
	return event.data.ref.parent.child('created').set(d);
});
