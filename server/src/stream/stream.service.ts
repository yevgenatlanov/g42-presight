import { Response } from "express";
import { faker } from "@faker-js/faker";

export class StreamService {
  streamText(res: Response, delay = 15): void {
    const text = faker.lorem.paragraphs(32);
    const chars = text.split("");
    let index = 0;
    let timeoutId: NodeJS.Timeout;

    const onClose = () => {
      clearTimeout(timeoutId);
      res.end(); // ensuring stream close "Once the stream is closed print entire response"
    };

    res.on("close", onClose);

    const sendNextChar = () => {
      if (index < chars.length) {
        res.write(chars[index]);
        index++;
        timeoutId = setTimeout(sendNextChar, delay);
      } else {
        res.end();
        res.off("close", onClose);
      }
    };

    sendNextChar();
  }
}
