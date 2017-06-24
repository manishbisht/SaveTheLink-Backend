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
	const original = event.data.val();
	var client = new MetaInspector(original, { timeout: 10000 });
	client.on("fetch", function(){
		event.data.ref.parent.child('title').set(client.title);
		event.data.ref.parent.child('description').set(client.description);
		console.log(client.title);
	});
	client.on("error", function(err) {
		console.log(err);
	});
	client.fetch();
	console.log('Uppercasing', event.params.pushId, original);
	const uppercase = original.toUpperCase();
	// You must return a Promise when performing asynchronous tasks inside a Functions such as
	// writing to the Firebase Realtime Database.
	// Setting an "uppercase" sibling in the Realtime Database returns a Promise.
	return event.data.ref.parent.child('uppercase').set(uppercase);
});
