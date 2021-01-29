const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jsonParser = bodyParser.json()

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mailjet = require('node-mailjet').connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET)
const PORT = process.env.PORT || 3000;

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

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/sms', jsonParser, function (req, res) {
    getEmailRequest(req.body)
        .then((result) => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err.statusCode)
            res.sendStatus(500);
        })
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})
