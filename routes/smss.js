const express = require('express');
const router = express.Router();
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mailjet = require('node-mailjet').connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET)

function getEmailRequest(sms) {
    return mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": process.env.FROM_EMAIL,
                        "Name": "SMS to EMAIL"
                    },
                    "To": [
                        {
                            "Email": process.env.TO_EMAIL,
                            "Name": "Manuel"
                        }
                    ],
                    "Subject": "SMS from " + sms.from,
                    "TextPart": "SMS from " + sms.from + " with content " + sms.message,
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        })
}

router.post('/', function (req, res) {
    getEmailRequest(req.body)
        .then((result) => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err.statusCode)
            res.sendStatus(500);
        })
})

module.exports = router;
