import { FlexContainer } from "@line/bot-sdk/dist/messaging-api/model/models";
import { lineClient } from "..";
import * as line from "@line/bot-sdk";
import { LocationMessageContent } from "@line/bot-sdk/dist/webhook/api";
export class Client {
  private replyToken: string;
  constructor(replyToken: string) {
    this.replyToken = replyToken;
  }

  public text(text: string) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "text",
          text: text,
        },
      ],
    });
  }

  public sticker(packageID: string, stickerID: string) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "sticker",
          packageId: packageID,
          stickerId: stickerID,
        },
      ],
    });
  }

  public image(originalContentUrl: string, previewImageUrl: string) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "image",
          originalContentUrl: originalContentUrl,
          previewImageUrl: previewImageUrl,
        },
      ],
    });
  }

  public video(originalContentUrl: string, previewImageUrl: string) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "video",
          originalContentUrl: originalContentUrl,
          previewImageUrl: previewImageUrl,
        },
      ],
    });
  }

  public audio(originalContentUrl: string, duration: number) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "audio",
          originalContentUrl: originalContentUrl,
          duration: duration,
        },
      ],
    });
  }

  public location(location: line.LocationMessage) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "location",
          title: location.title,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      ],
    });
  }

  public confirm(confirm: line.TemplateConfirm) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "template",
          altText: "this is a confirm template",
          template: confirm,
        },
      ],
    });
  }

  public template(template: line.TemplateMessage) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [template],
    });
  }

  public flex(flexContainer: FlexContainer) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "flex",
          altText: "This is a Flex Message",
          contents: flexContainer,
        },
      ],
    });
  }

  public carousel(carousel: line.TemplateCarousel) {
    lineClient.replyMessage({
      replyToken: this.replyToken,
      messages: [
        {
          type: "template",
          altText: "this is a carousel template",
          template: carousel,
        },
      ],
    });
  }
}
