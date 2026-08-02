import * as dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function checkAccount() {
  try {
    const account = await client.api.v2010.accounts(process.env.TWILIO_ACCOUNT_SID!).fetch();
    console.log("Account Name:", account.friendlyName);
    console.log("Account Type:", account.type);
    console.log("Account Status:", account.status);
    if (account.type === 'Full') {
      console.log("✅ Twilio is UPGRADED.");
    } else {
      console.log("❌ Twilio is still on TRIAL mode.");
    }
  } catch (err: any) {
    console.error("Failed to fetch Twilio account info:", err.message);
  }
}

checkAccount();
