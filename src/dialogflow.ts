import { Request, Response } from "express";
import { WebhookClient } from "dialogflow-fulfillment";
import { Client } from "./client";
import { chatWithOwnData, showLoadingAnimation } from "./gemini";
import dotenv from "dotenv";
dotenv.config();

export const handleDialogflowFulfillmentWebhook = async (
  req: Request,
  res: Response
) => {
  let client: Client;
  if (req.method === "POST") {
    const userID =
      req.body.originalDetectIntentRequest.payload.data.source.userId;
    const replyToken =
      req.body.originalDetectIntentRequest.payload.data.replyToken;

    const agent = new WebhookClient({ request: req, response: res });
    client = new Client(replyToken);
    console.log("Query Text: " + agent.query);
    showLoadingAnimation(userID);
    const result = await chatWithOwnData(agent.query);
    client.text(result);
  }
  res.status(200).end();
};
