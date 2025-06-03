// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');

import nodemailer, { SentMessageInfo } from 'nodemailer'
import dotenv from 'dotenv'
import { Response } from 'express'

dotenv.config();

const userSendMail = (to: string, otp: string, titleTxt: string, _res: Response) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: `Dentalign - OTP Verification`,
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #e8f0fe; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #0072ce;">${titleTxt}</h2>
                        <p style="font-size: 16px; color: #333;">Dear Dentalign User,</p>
                        <p style="font-size: 16px; color: #333;">
                            To proceed with your request, please use the following One-Time Password (OTP). This code will expire in 10 minutes.
                        </p>
                        <h1 style="font-size: 36px; color: #0072ce; letter-spacing: 6px; margin: 20px 0;">${otp}</h1>
                        <p style="font-size: 14px; color: #555;">
                            If you did not request this OTP, please disregard this message or contact our support team.
                        </p>
                        <p style="font-size: 14px; color: #555; margin-top: 30px;">
                            Best regards,<br/>
                            The Dentalign Team<br/>
                            Your trusted dental clinic
                        </p>
                    </div>
                </body>
            </html>
        `
    };

<<<<<<< HEAD
    transporter.sendMail(mailOptions, (err:any, info:any) => {
=======
    transporter.sendMail(mailOptions, (err: Error | null, info: SentMessageInfo) => {
>>>>>>> 06dd04c2edd2f39c8334a7d5dcd4898f4840bad8
        if (err) return err;
        return info;
    });
}

const sendTicketResponseEmail = (to: string, ticketId: string, ticketTitle: string, ticketDescription: string, adminResponse: string) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: `Dentalign - Response to Ticket #${ticketId}`,
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #e8f0fe; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #0072ce;">Response to Your Ticket</h2>
                        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                            <p style="margin: 0;"><strong>Ticket ID:</strong> ${ticketId}</p>
                            <p style="margin: 5px 0;"><strong>Title:</strong> ${ticketTitle}</p>
                            <p style="margin: 5px 0;"><strong>Description:</strong> ${ticketDescription}</p>
                        </div>
                        <div style="margin: 20px 0;">
                            <h3 style="color: #333;">Admin Response:</h3>
                            <p style="font-size: 16px; color: #333; white-space: pre-wrap;">${adminResponse}</p>
                        </div>
                        <p style="font-size: 14px; color: #555; margin-top: 30px;">
                            Best regards,<br/>
                            The Dentalign Team<br/>
                            Your trusted dental clinic
                        </p>
                    </div>
                </body>
            </html>
        `
    };

<<<<<<< HEAD
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err:any, info:any) => {
=======
    return new Promise<SentMessageInfo>((resolve, reject) => {
        transporter.sendMail(mailOptions, (err: Error | null, info: SentMessageInfo) => {
>>>>>>> 06dd04c2edd2f39c8334a7d5dcd4898f4840bad8
            if (err) reject(err);
            resolve(info);
        });
    });
}

export { userSendMail, sendTicketResponseEmail };