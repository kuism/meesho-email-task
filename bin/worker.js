// my_queue_worker.js

const Queue = require('firebase-queue'),
    config = require('../configs/config');

const EmailHistory = require("../models/email_history");

var refQueue = config.FIREBASE_ADMIN.database().ref(config.FB_QUEUE_PATH);


console.log("worker started");

const queue = new Queue(refQueue, function (data, progress, resolve, reject) {
    console.log(data);

    switch (data.channel){
        case "create-order": {
            try {
                EmailHistory.processEmailForItem(data.item_id, data.item_type, null)
            } catch (err){

            }
            break;
        }
        default:

    }

    // Finish the task asynchronously
    setTimeout(function() {
        resolve();
    }, 1000);
});
