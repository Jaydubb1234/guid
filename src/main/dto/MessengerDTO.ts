import {DTO} from "./DTO";
import {IMessengerGetSQL, IMessengerResponse} from "../service/interfaces/IMessenger";

export class MessengerDTO extends DTO {
    public constructor(private messages: IMessengerGetSQL[]) {
        super();
    }

    public jsonSerialize(): string {
        return JSON.stringify(this.transformSQL());
    }

    public transformSQL(): IMessengerResponse {
      const map = {}

      this.messages.forEach(message => {
        if (map[message.sender_id]) {
          map[message.sender_id].push({message: message.message, sentTime: message.sent_time})
        } else {
          map[message.sender_id] = [{message: message.message, sentTime: message.sent_time}]
        }
      })

      return { messages: map, size: this.messages.length };
    }

}
