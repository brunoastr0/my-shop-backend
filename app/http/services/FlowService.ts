import crypto from "crypto";

interface DecryptRequestBody {
    encrypted_flow_data: string;
    encrypted_aes_key: string;
    initial_vector: string;
}

interface DecryptedResponse {
    decryptedBody: any;
    aesKeyBuffer: Buffer;
    initialVectorBuffer: Buffer;
}
export type DecryptedRequest = {
    screen: string;
    data: Record<string, any>;
    version: string;
    action: string;
    flow_token: string;
};

type Item = {
    id: string;
    title: string;
    price: number;
};

type ScreenResponse = {
    screen: string;
    data: {
        items: Item[];
    };
};

const SCREEN_RESPONSES: Record<string, ScreenResponse> = {
    // ... Existing screens (APPOINTMENT, DETAILS, etc.)

    ITEM_SELECTION: {
        screen: "ITEM_SELECTION",
        data: {
            items: [
                { id: "item1", title: "T-Shirt", price: 19.99 },
                { id: "item2", title: "Jeans", price: 49.99 },
                { id: "item3", title: "Jacket", price: 79.99 },
            ],
        },
    },

    // Add other screens like SUCCESS, TERMS etc.
};
class FlowService {
    static decryptRequest(
        body: DecryptRequestBody,
        privatePem: string,
        passphrase: string
    ): DecryptedResponse {
        const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;
        console.log(body)

        const privateKey = crypto.createPrivateKey({ key: privatePem, passphrase });
        let decryptedAesKey: Buffer | null = null;

        try {
            // Decrypt AES key created by client
            decryptedAesKey = crypto.privateDecrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: "sha256",
                },
                Buffer.from(encrypted_aes_key, "base64")
            );
        } catch (error) {
            console.error(error);
            /*
            Failed to decrypt. Please verify your private key.
            If you change your public key, return HTTP status code 421 to refresh the public key on the client.
            */
            throw new FlowEndpointException(
                421,
                "Failed to decrypt the request. Please verify your private key."
            );
        }

        // Decrypt flow data
        const flowDataBuffer = Buffer.from(encrypted_flow_data, "base64");
        const initialVectorBuffer = Buffer.from(initial_vector, "base64");

        const TAG_LENGTH = 16;
        const encrypted_flow_data_body = flowDataBuffer.subarray(0, -TAG_LENGTH);
        const encrypted_flow_data_tag = flowDataBuffer.subarray(-TAG_LENGTH);

        const decipher = crypto.createDecipheriv(
            "aes-128-gcm",
            decryptedAesKey,
            initialVectorBuffer
        );
        decipher.setAuthTag(encrypted_flow_data_tag);

        const decryptedJSONString = Buffer.concat([
            decipher.update(encrypted_flow_data_body),
            decipher.final(),
        ]).toString("utf-8");

        return {
            decryptedBody: JSON.parse(decryptedJSONString),
            aesKeyBuffer: decryptedAesKey,
            initialVectorBuffer,
        };
    }

    static encryptResponse(
        response: any,
        aesKeyBuffer: Buffer,
        initialVectorBuffer: Buffer
    ): string {
        // Flip initial vector
        const flipped_iv: number[] = [];
        for (const pair of initialVectorBuffer.entries()) {
            flipped_iv.push(~pair[1]);
        }

        // Encrypt response data
        const cipher = crypto.createCipheriv(
            "aes-128-gcm",
            aesKeyBuffer,
            Buffer.from(flipped_iv)
        );
        return Buffer.concat([
            cipher.update(JSON.stringify(response), "utf-8"),
            cipher.final(),
            cipher.getAuthTag(),
        ]).toString("base64");
    }





    static getNextScreen = async (decryptedBody: DecryptedRequest) => {
        const { screen, data, version, action, flow_token } = decryptedBody;


        if (action === "ping") {
            return {
                data: {
                    status: "active",
                },
            };
        }
        // Handle the ITEM_SELECTION screen
        if (action === "data_exchange") {
            switch (screen) {
                case "ITEM_SELECTION":
                    // Handle the item selection
                    const selectedItem = data.selected_item;  // Assume `selected_item` is provided from user input
                    const selectedItemData = SCREEN_RESPONSES.ITEM_SELECTION.data.items.find(
                        (item: { id: any; }) => item.id === selectedItem
                    );

                    if (selectedItemData) {
                        // Prepare response data for next screen
                        return {
                            ...SCREEN_RESPONSES.ITEM_SELECTION,
                            data: {
                                ...SCREEN_RESPONSES.ITEM_SELECTION.data,
                                selected_item_data: selectedItemData,  // Include the details of selected item
                            },
                        };
                    } else {
                        console.warn("Invalid selected item:", selectedItem);
                        return {
                            data: { error: "Invalid item selected" },
                        };
                    }

                // Add handling for other screens like APPOINTMENT, DETAILS, etc.

                default:
                    break;
            }
        }

        // Handle other actions like INIT, ping, etc.
        // Handle errors and unknown request bodies
    };

}

export class FlowEndpointException extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

export const encryptResponse = FlowService.encryptResponse;
export const decryptRequest = FlowService.decryptRequest;
export const getNextScreen = FlowService.getNextScreen;

