import * as HttpStatus from "http-status";

import {Response} from "../lib/Response";
import {Logger} from "../util/Logger";
import {MySqlConnectionManager} from "../util/connectionManager/MySqlConnectionManager";
import {BaseController} from "./BaseController";
import { MessengerService } from "../service/MessengerService";
import {IMessengerGetSQL} from "../service/interfaces/IMessenger";
import {MessengerDTO} from "../dto/MessengerDTO";
import {
    messengerSchema,
} from "../util/requestValidation/schemas/messengerSchema";

export class MessengerController extends BaseController {

    public constructor(
        private messengerService: MessengerService,
        private mySqlReadConnectionManager: MySqlConnectionManager,
        private mySqlWriteConnectionManager: MySqlConnectionManager,
        private logger: Logger,
        private ajv: any,
        private moment: any,
    ) {
        super();
    }

    public async GET(event: any): Promise<Response> {
        const {getQueryStringParameters, getPathParam}: BaseController = this;
        const recipientId: string = getPathParam(event, "userId");
        const offset: string = getQueryStringParameters(event, "offset");
        const limit: string = getQueryStringParameters(event, "limit");
        const senderIds: string[] = getQueryStringParameters(event, "senderIds")?.split(',');

        try {

            const recpientMessages: IMessengerGetSQL[] = senderIds && senderIds.length ?
              await this.messengerService.getMesseges(
                recipientId,
                senderIds,
                offset,
                limit
              ) :
              await this.messengerService.getAllMesseges(
                recipientId,
                offset,
                limit
              );

          if (!recpientMessages) {
              return new Response(HttpStatus.NOT_FOUND, {}, { error: "Alerts preferences not found." });
          }

          return new Response(HttpStatus.OK, {}, new MessengerDTO(recpientMessages));

        } catch (e) {
            this.logger.error(JSON.stringify({...event, ...e}));
            return this.handleError(e);
        } finally {
            await this.mySqlReadConnectionManager.closeConnection();
        }
    }

  public async POST(event: any): Promise<Response> {
      const body: any = JSON.parse(event.body);
    
      const {getPathParam}: BaseController = this;
      const recipientId: string = getPathParam(event, "userId");
      try {
          this.ajv.validate(messengerSchema, body);
          await this.messengerService.saveMessage(
            recipientId,
            body,
          );
          return new Response(
              HttpStatus.CREATED,
              {},
              {},
          );
      } catch (e) {
          this.logger.error(JSON.stringify({...event, ...e}));
          return this.handleError(e);
      } finally {
          await this.mySqlWriteConnectionManager.closeConnection();
      }
    }

}
