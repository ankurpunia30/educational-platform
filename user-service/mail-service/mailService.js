// mailService.js
const nodemailer = require('nodemailer');

// Configure the transporter with your email provider
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send registration email
const sendRegistrationEmail = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Welcome to EduMitar!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
                        .header { background-color: #4CAF50; padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0; }
                        .header h1 { margin: 0; font-size: 24px; }
                        .content { padding: 20px; }
                        .content p { margin: 10px 0; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #777; }
                        .btn { display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to EduMitar!</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${userName},</p>
                            <p>Thank you for registering with EduMitar! We’re thrilled to have you on board.</p>
                            <p>If you have any questions or need assistance, please feel free to reach out.</p>
                            <a href="https://EduMitar.com" class="btn">Get Started</a>
                            <p>Best regards,<br>The EduMitar Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} EduMitar. All rights reserved.</p>
                            <p><a href="https://EduMitar.com/privacy">Privacy Policy</a> | <a href="https://EduMitar.com/terms">Terms of Service</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Registration email sent to ${userEmail}`);
    } catch (error) {
        console.error(`Error sending registration email to ${userEmail}:`, error);
    }
};

module.exports = { sendRegistrationEmail };
