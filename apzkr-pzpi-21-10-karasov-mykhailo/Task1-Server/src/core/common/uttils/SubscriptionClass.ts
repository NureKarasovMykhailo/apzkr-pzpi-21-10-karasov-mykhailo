import * as dotenv from 'dotenv';
import * as process from "process";
import Subscribe from "../../domain/models/Subscribe/Subscribe";


dotenv.config();

export default class SubscriptionClass {

    private RETURN_URL:string = 'http://localhost:3000/profile/subscribe/success';
    private CANCEL_URL:string = 'http://localhost:3000/profile/subscribe/fail';
    private AUTH: string = Buffer.from(process.env.CLIENT_ID + ':' + process.env.PAY_PAL_SECRET_KEY).toString('base64');
    private SUBSCRIPTION_PAY_LOAD = {
        "plan_id": process.env.PLAN_ID,
        "application_context": {
            "brand_name": "TaskSync Subscription",
            "locale": "en-US",
            "user_action": "SUBSCRIBE_NOW",
            "payment_method": {
                "payer_selected": "PAYPAL",
                "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
            },
            "return_url": this.RETURN_URL,
            "cancel_url": this.CANCEL_URL
        }
    }

    constructor() {

    }

    async subscribeRequest() {

        return await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
            method: 'post',
            body: JSON.stringify(this.SUBSCRIPTION_PAY_LOAD),
            headers: {
                'Authorization': 'Basic ' + this.AUTH,
                'Content-Type': 'application/json'
            },
        });
    }

    async isSubscriptionValid(subscribe: Subscribe) {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscribe.code}`, {
            method: 'get',
            headers: {
                'Authorization': 'Basic ' + this.AUTH,
                'Content-Type': 'application/json'
            }
        });
        const subscriptionDetails = await response.json();
        console.log(subscriptionDetails.status)
        return subscriptionDetails.status === 'ACTIVE' || subscriptionDetails.status === 'APPROVAL_PENDING' || subscriptionDetails.status === 'EXPIRED';
    }
}