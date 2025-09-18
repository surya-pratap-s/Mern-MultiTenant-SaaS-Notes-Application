import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendInvitationEmail = async (to, code) => {
    const link = `${process.env.CLIENT_URL}/signup`;

    await transporter.sendMail({
        from: `"Notes App" <${process.env.EMAIL_USER}>`,
        to,
        subject: "You are invited to join Tenant",
        html: `<p> Hi <b> ${to}</b>,</p>
        <p>Your Refrel ID is <b>${code}</b> has been created.</p>
        <div style="margin:20px 0;text-align:center;">
            <a href="${link}" 
                style="background:#e63946;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
                Complete Your Profile And Then Login
            </a>
        </div>
     `,
    });
};
