import { NextResponse } from "next/server";
import Users from "/mongo/UserModel";
import cryptoJS from 'crypto-js'
import cron from 'node-cron';
import { cookies } from 'next/headers';
import { sign } from "jsonwebtoken";
import { TOCKEN_MAX_AGE, CODER_CHANNEL_TOCKEN } from '../../../constants'
import { sendVerificationEmail } from '../../../sendMailToUser'


cron.schedule('*/10 * * * *', async () => {
  try {
    const now = new Date();
    await Users.deleteMany({
      verify: false,
      createdAt: { $lt: new Date(now - 10 * 60 * 1000) }
    });
    // console.log('Deleting unverified users registered more than 10 minutes ago');
  } catch (error) {
    console.error('Error deleting unverified users:', error.message);
  }
});


export async function GET() {
  try {
    let users = await Users.find({ verify: true });
    return NextResponse.json({ users, success: true });
  } catch (err) {
    return NextResponse.json({ success: false });
  }
}


export async function POST(req, res) {
  try {
    let data = await req.json();
    let email = data.email;
    // Encrypting the password
    let ciphertext = cryptoJS.AES.encrypt(data.password, email).toString();
    let user = new Users({ ...data, verify: false, password: ciphertext });
    await user.save();

    await sendVerificationEmail(email, user._id);
    return NextResponse.json({ message: "Verification Link sent successfully to your Email...! It will be valid only for 10 minutes, If you fails to verify within the time your registration will be cancelled. And you have to register again for further process", success: true });
  }
  catch (error) {
    return NextResponse.json({ message: error.message, success: false });
  }
}


export async function PUT(req) {
  try {
    let data = await req.json();
    let { email, password } = data;

    if (!email) {
      return NextResponse.json({ message: "bad request! No email found.", success: false });
    }

    let User = (await Users.findOne({ email })).toObject();
    let bytes = cryptoJS.AES.decrypt(User.password, email);
    let pass = bytes.toString(cryptoJS.enc.Utf8);

    if (!User) {
      return NextResponse.json({ message: "No such account found...!", success: false });
    }
    else if (password !== pass) {
      return NextResponse.json({ message: "wrong credentials, Try again...!", success: false });
    }

    if (!User.verify) {
      return NextResponse.json({ message: "email verification required...!", success: false });
    }
    const secret = process.env.JWT_SECRET_KEY || "";
    const tocken = sign({ _id:User._id }, secret, { expiresIn: TOCKEN_MAX_AGE });

    // cookies().set(CODER_CHANNEL_TOCKEN, tocken, { maxAge: TOCKEN_MAX_AGE, sameSite: 'Strict' });

    cookies().set({
      name: CODER_CHANNEL_TOCKEN,
      value: tocken,
      // secure: process.env.NODE_ENV === 'production' && window.location.protocol === 'https:',
      httpOnly: true,
      sameSite: "strict",
      maxAge: TOCKEN_MAX_AGE,
      path: "/"
    });

    delete User.password;
    return NextResponse.json({ User, success: true, message: `You credentials are right and you have Logged-in...!` })
  } catch (error) {
    // console.log(error.message);
    return NextResponse.json({ message: "bad request, Try again...!", success: false });
  }
}

