import { Router } from 'express';


const router = Router();



const VERIFY_TOKEN = process.env.WEBHOOK_TOKEN; // Retrieve from .env or set directly



router.get('/webhook', async (req, res, next) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        // Respond with the challenge code to verify the webhook
        console.log(req.body)
        console.log("Webhook verified successfully.");
        res.status(200).send(challenge);
    } else {
        // Unauthorized access if the token doesn't match
        res.status(403).send('Forbidden');
    }
})

router.post('/webhook', async (req, res) => {
    // Log the entire request body to the console
    //@ts-ignore
    const body = JSON.parse(req.rawBody)
    console.log('Webhook received: ', JSON.stringify(body, null, 2));

    // You can also log specific parts of the request body if you need to inspect certain fields
    body.entry.forEach((entry: { id: any; changes: any[]; }) => {
        console.log('Entry ID:', entry.id);
        entry.changes.forEach(change => {
            console.log('Change:', JSON.stringify(change, null, 2));
        });
    });

    // Respond back to acknowledge receipt of the message
    res.status(200).send('Message received');
});



export default router;
