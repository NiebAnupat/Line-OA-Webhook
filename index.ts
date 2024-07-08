import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import * as line from "@line/bot-sdk";
import dotenv from "dotenv";
import { handleWebhook } from "./src/handleWebhook";
import { handleDialogflowFulfillmentWebhook } from "./src/dialogflow";

//For env File
dotenv.config();

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 8000;

const lineConfig: line.MiddlewareConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
};

const MessagingApiClient = line.messagingApi.MessagingApiClient;
export const lineClient = new MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const time = new Date().toISOString();
  console.log(`${req.method} ${req.url} | ${time}`);
  // console.log({ req });
  // console.log(`Headers: ${JSON.stringify(req.headers)}`);
  console.log(`Body:`);
  console.log(req.body);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.status(405).send("Method Not Allowed");
  res.end();
});

// app.use(line.middleware(lineConfig));

app.post("/webhook", line.middleware(lineConfig), handleWebhook);
app.post("/DialogflowFulfillment", handleDialogflowFulfillmentWebhook);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof line.SignatureValidationFailed) {
    res.status(401).send(err.signature);
    return;
  } else if (err instanceof line.JSONParseError) {
    res.status(400).send(err.raw);
    return;
  }
  next(err); // will throw default 500
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port} ⚡`);
});
