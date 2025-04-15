import twilio from 'twilio'
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = twilio(accountSid,authToken)

export const sendOTP = async(phone_no,otp)=>{

    try {
        const message = await client.messages.create({
            body:`Your otp for Ticketribe login  ${otp}`,
            from: process.env.phone_number,
            to : `+91${phone_no}`
        });
        console.log('otp sent', message.sid)
        return true;
    } catch (error) {
        console.error(error)
        return false;
    }
}