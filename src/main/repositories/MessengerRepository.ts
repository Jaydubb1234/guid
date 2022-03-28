import {MySqlConnectionManager} from "../util/connectionManager/MySqlConnectionManager";
import {IMessengerGetSQL} from "../service/interfaces/IMessenger";
import {Logger} from "../util/Logger";

export class MessengerRepository {
  private static readonly GET_ALL_MESSAGES: string = `\
  SELECT
    sender_id,
    message,
    time_sent
  FROM
    messages
  WHERE
    recipient_id = ?
  AND
    time_sent > WHERE NOW() - INTERVAL 30 DAY
  ORDER BY id DESC
  LIMIT ?,?`;

  private static readonly GET_MESSAGES: string = `\
  SELECT
    sender_id,
    message,
    time_sent
  FROM
    messages
  WHERE
    recipient_id = ?
  AND
    sender_id in (?)
  AND
    time_sent > WHERE NOW() - INTERVAL 30 DAY
  ORDER BY id DESC
  LIMIT ?,?`;

  private static readonly SAVE_MESSAGE: string = `\
  INSERT INTO messages (recipient_id, sender_id, message, sent_time)
  VALUES(?, ?, ?, ?)`;

  public constructor(
    private readerConnectionManager: MySqlConnectionManager,
    private writerConnectionManager: MySqlConnectionManager,
    private logger: Logger,
  ) {
    }

    public async getAllMessages(recipientId: string, offset: number, limit: number): Promise<IMessengerGetSQL[]> {
        return await this.readerConnectionManager.runQuery(
            MessengerRepository.GET_ALL_MESSAGES,
              recipientId,
              offset || 0,
              !limit || limit > 100 ? 100 : limit,
        );
    }
  
    public async getMessages(recipientId: string, senderIds: string[], offset: number, limit: number): Promise<IMessengerGetSQL[]> {
      return await this.readerConnectionManager.runQuery(
          MessengerRepository.GET_MESSAGES,
            recipientId,
            ...senderIds,
            offset || 0,
            !limit || limit > 100 ? 100 : limit,
      );
    }
  
  public async saveMessage(recipientId: string, body: any): Promise<IMessengerGetSQL[]> {
      const { senderId, message, sentTime } = body;
      return await this.writerConnectionManager.runQuery(
          MessengerRepository.SAVE_MESSAGE,
            recipientId,
            senderId,
            message,
            sentTime,
      );
    }

}
