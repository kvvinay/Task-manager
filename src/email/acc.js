const sendgrid = require('@sendgrid/mail')

const savegridapiKey = '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'

sendgrid.setApiKey(savegridapiKey)


const sendEmailNow = async () => {
        await sendgrid.send({
        to: 'vinayk4697@gmail.com',
        from: 'vinaykv4697@gmail.com',
        subject: 'Test',
        text: 'test email sending...!'
    })
}
sendEmailNow()