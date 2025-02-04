import { Request, Response } from "express";
import crypto from "crypto";
import { decryptRequest, encryptResponse, FlowEndpointException, getNextScreen } from "../services/FlowService";

export class FlowController {
    static decrypt(req: Request, res: Response) {
        try {
            const { privatePem, passphrase } = req.body;

            if (!privatePem || !passphrase) {
                return res.status(400).json({ error: "Missing required fields." });
            }

            const decryptedData = decryptRequest(req.body, privatePem, passphrase);

            res.status(200).json({ decrypted: decryptedData.decryptedBody });
        } catch (error) {
            if (error instanceof FlowEndpointException) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            console.error(error);
            res.status(500).json({ error: "Internal server error." });
        }
    }

    static encrypt(req: Request, res: Response) {
        try {
            const { response, aesKeyBuffer, initialVectorBuffer } = req.body;

            if (!response || !aesKeyBuffer || !initialVectorBuffer) {
                return res.status(400).json({ error: "Missing required fields." });
            }

            const encryptedData = encryptResponse(response, Buffer.from(aesKeyBuffer, "base64"), Buffer.from(initialVectorBuffer, "base64"));

            res.status(200).json({ encrypted: encryptedData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error." });
        }
    }
    static isRequestSignatureValid(req: Request): boolean {
        const APP_SECRET = process.env.APP_SECRET || ""
        if (!APP_SECRET) {
            console.warn(
                "⚠️ App Secret is not set up. Please add your app secret in the .env file to enable request validation."
            );
            return true; // If no secret is set, assume valid (Not recommended for production)
        }

        const signatureHeader = req.get("x-hub-signature-256");

        if (!signatureHeader) {
            console.error("❌ Error: Missing signature header.");
            return false;
        }

        try {

            const signatureBuffer = Buffer.from(signatureHeader.replace("sha256=", ""), "hex");
            const hmac = crypto.createHmac("sha256", APP_SECRET);
            //@ts-ignore
            const digestBuffer = hmac.update(req.rawBody).digest();
            return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
        } catch (error) {
            console.error("❌ Error validating request signature:", error);
            return false;
        }
    }


    static async handleFlowRequest(req: Request, res: Response): Promise<Response> {
        const PRIVATE_KEY = process.env.PRIVATE_KEY
        const PASSPHRASE = process.env.PASSPHRASE || ""
        if (!PRIVATE_KEY) {
            throw new Error(
                'Private key is empty. Please check your env variable "PRIVATE_KEY".'
            );
        }

        if (!FlowController.isRequestSignatureValid(req)) {
            return res.status(432).send();
        }

        let decryptedRequest;
        try {
            // @ts-ignore

            decryptedRequest = decryptRequest(JSON.parse(req.rawBody), PRIVATE_KEY, PASSPHRASE);
        } catch (err) {
            console.error(err);
            if (err instanceof FlowEndpointException) {
                return res.status(err.statusCode).send();
            }
            return res.status(500).send();
        }

        const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;
        console.log("💬 Decrypted Request:", decryptedBody);

        /*
        // TODO: Implement flow token validation logic here.
        if (!isValidFlowToken(decryptedBody.flow_token)) {
          const errorResponse = { error_msg: "The message is no longer available" };
          return res
            .status(427)
            .send(FlowService.encryptResponse(errorResponse, aesKeyBuffer, initialVectorBuffer));
        }
        */

        const screenResponse = await getNextScreen(decryptedBody);
        console.log("👉 Response to Encrypt:", screenResponse);

        return res.send(encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer));
    }
}
