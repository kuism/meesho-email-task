// eslint-disable-next-line prefer-destructuring
const mongoose = require("./__connection").mongoose;

const Schema = mongoose.Schema;

const emailHistory = Schema({
    item_id: {type: String},
    item_type: {type: String},
    send_email_types: {type: [String], enum: ["WITH-A", "WITHOUT-A"]}, //
    created_at: {type: Number, default: new Date().getTime()/1000}
});

module.exports =  mongoose.model('emailHistories', emailHistory);
exports =  mongoose.model('emailHistories', emailHistory);