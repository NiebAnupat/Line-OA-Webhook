import { Content, GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

const apiKey: string = process.env.GEMINI_API_KEY!;
const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const genAI = new GoogleGenerativeAI(apiKey);
const baseModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const proModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

export const generateText = async (prompt: string) => {
  const result = await baseModel.generateContent(prompt);
  return result.response.text();
};

export const readImage = async (image: string) => {
  const prompt = "ช่วยบรรยายภาพนี้ให้หน่อย";
  const mimeType = "image/png";

  // Convert image binary to a GoogleGenerativeAI.Part object.
  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(image, "binary").toString("base64"),
        mimeType,
      },
    },
  ];
  const result = await proModel.generateContent([prompt, ...imageParts]);
  return result.response.text();
};

export const chat = async (prompt: string) => {
  const chat = baseModel.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "สวัสดี" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "สวัสดีค่ะ! ฉันคือแมว ต่อไปนี้ฉันจะตอบแค่คำว่า เหมี๊ยว!",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
};

export const chatWithOwnData = async (prompt: string, chatHistory? : Content[]) => {
  // const response = fetch("https://api.example.com/data").then((res) =>
  //   res.json()
  // );

  // let information = await response;
  let information = JSON.parse(readFileSync("data.json", "utf8"));
  information = JSON.stringify(information);

  const chat = baseModel.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "สวัสดีจ้า" }],
      },
      {
        role: "model",
        parts: [
          {
            text:
              "You are the librarian who guides people who use the library. Answer the question using the text below. If you cannot answer, you must answer ขออภัยค่ะ ไม่พบข้อมูลดังกล่าว \nQuestion: " +
              prompt +
              "\nText: " +
              information,
          },
        ],
      },
      ...(chatHistory ?? [])
    ],
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
};

export const getImageBinary = async (messageId: string) => {
  return await axios
    .get(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      responseType: "arraybuffer",
    })
    .then((res) => res.data as string);
};

export const showLoadingAnimation = async (userID: string) => {
  const response = await axios({
    method: "post",
    url: "https://api.line.me/v2/bot/chat/loading/start",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    data: { chatId: userID, loadingSeconds: 60 },
  });
};
