import { NextResponse } from "next/server";
import Users from "/mongo/UserModel";
import { sendVerificationEmail } from "../../../../sendMailToUser";


export async function POST(req) {
  try {
    let origin = (req.url).slice(0 , -17);
    let data = await req.json();
    let email = data.email;
  
    if (!email) {
      return NextResponse.json({ message: "Missing email...!" });
    }
  
    let check = await Users.findOne(data);
    // console.log(check , email , data);
    
    if (!check) {
      return NextResponse.json({ message: "Email is not resistered..!" });
    }
    else if(check.verify) {
      return NextResponse.json({ message: "Email is already verified, you can login now..!" });
    }
    else {
        let token = check._id;
        await sendVerificationEmail(check.email, token , origin);
        return NextResponse.json({ message: "Verification Link sent successfully to your Email...!" });
    }
  } catch (error) {
    // console.error(error.message);
    return NextResponse.json({ message: error.message });
  }
}
