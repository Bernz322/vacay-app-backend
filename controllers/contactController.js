const nodemailer = require("nodemailer");

const send = async (req, res) => {
    const { name,
        email,
        subject,
        message } = req.body

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });

        const toSend = {
            from: email,
            to: process.env.SEND_TO,
            subject: subject,
            html: `<div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
            <div style="max-width: 700px; background-color: white; margin: 0 auto">
              <div style="width: 100%; background-color: #c1c2c5; padding: 20px 0">
              <a href="${process.env.CLIENT_URL}" ><img
                  src="https://vacaycaraga.netlify.app/static/media/Logo.37e0345ee6752335a652.png"
                  style="width: 100%; height: 70px; object-fit: contain"
                /></a>
              </div>
              <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
                <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
                  From Vacay CARAGA
                </p>
                <div style="font-size: .8rem; margin: 0 30px">
                    <p>Name: <b>${name}</b></p>
                    <p>Email: <b>${email}</b></p>
                    <p>Subject: <b>${subject}</b></p>
                    <p>Message: <i>${message}</i></p>
                </div>
              </div>
            </div>
          </div>`,
        }

        transporter.sendMail(toSend, (err, info) => {
            if (err) {
                console.log(err);
                return;
            }
        });

        res.status(200).json({ message: "Sent successfully" })
    } catch (error) {
        res.status(500).json({ message: "Sending message failed!" })
    }
}

module.exports = { send }