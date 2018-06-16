const express = require('express');

const router = express.Router();
const EmailHistory = require("../models/email_history");

router.post("", async(req, res) => {
    EmailHistory.processEmailForItem(req.body.item_id, req.body.item_type, req.body.attachment).then((data) => {
        res.send(data)
    }).catch(err => {
        res.status(400)
        res.send({data: err})
    })
});

router.get("/:item_type/:item_id", async(req, res) => {
    EmailHistory.getEmailHistoryForAnItem(req.params.item_id, req.params.item_type).then((data) => {
        res.send(data)
    }).catch((err => {
        res.status(400);
        res.send({data: err, success: false})
    }))
});

module.exports = router;