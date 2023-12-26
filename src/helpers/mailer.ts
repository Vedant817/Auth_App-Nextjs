import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        //? Creating a hashed token
        const hashedToken = bcryptjs.hash(userId.toString(), 10);
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                userId,
                { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 },
                { new: true, runValidators: true }
            );
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(
                userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000,
                },
                { new: true, runValidators: true }
            );
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "fadd65476e0a97",
                pass: "7de3a085749f4d",
            },
        });

        const mailOptions = {
            from: "v@gmail.com",
            to: email,
            subject:
                emailType === "VERIFY" ? "Verify your email" : "Reset your Password",
            html: `<p>Click <a href="${process.env.DOMAIN
                }/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"
                }</p>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
