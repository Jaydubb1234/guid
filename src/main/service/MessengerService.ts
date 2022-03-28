import {MessengerRepository} from "../repositories/MessengerRepository";
import { Logger } from "../util/Logger";
import {IMessengerGetSQL} from "./interfaces/IMessenger";


export class MessengerService {
  public constructor(
    private messengerRepository: MessengerRepository,
    private logger: Logger,) {
    }

    public async getAllMesseges(
      recipientId: string,
      offset?: string,
      limit?: string,
  ): Promise<IMessengerGetSQL[]> {
      return await this.messengerRepository.getAllMessages(
          recipientId,
          +offset,
          +limit,
      );
    }
  
    public async getMesseges(
      recipientId: string,
      senderIds: string[],
      offset?: string,
      limit?: string,
    ): Promise<IMessengerGetSQL[]> {
        return await this.messengerRepository.getMessages(
          recipientId,
          senderIds,
          +offset,
          +limit,
        );
      }
  
    public async saveMessage(
      recipientId: string,
      body: any,
  ): Promise<any> {
      return await this.messengerRepository.saveMessage(
        recipientId,
        body
      );
  }
}
