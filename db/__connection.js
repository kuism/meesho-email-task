/**
 * Created by kuku on 31/10/17.
 */

const mongoose = require("mongoose");
const bluebird = require("bluebird");

const Config  = require("../configs/config");

mongoose.Promise = require('bluebird');
mongoose.connect(Config.MONGO_URL);

exports.mongoose = mongoose;