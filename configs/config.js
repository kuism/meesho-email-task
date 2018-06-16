exports.MONGO_URL = process.env.MONGO_INVOICE_SERVICE_URL || 'mongodb://127.0.0.1:27017/email-service';

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./meesho-task-queue");

exports.FIREBASE_ADMIN = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL:"https://meesho-task-queue.firebaseio.com/"
});

exports.FB_QUEUE_PATH = process.env.FB_QUEUE_PATH || "invoice-service";

exports.MicroServices = {
    invoiceService: "http://127.0.0.1:3001/",
    emailService: "http://127.0.0.1:3002/",
    orderService: "https://orbiz.herokuapp.com/"
};