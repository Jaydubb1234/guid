import * as handler from "../../../index";
import {ApplicationContainer} from "../../../main/dependencyInjection/ApplicationContainer";
import {PromiseMySqlMock} from "../../mocks/promise-mysql/PromiseMySqlMock";
import {ConnectionConfig} from "promise-mysql";
import {Logger} from "../../../main/util/Logger";
import {mockMoment} from "../../mocks/mockMent";

describe("/user/{userId}/messenger", () => {
    let applicationContainer: ApplicationContainer;
    const moment: any = mockMoment;

    const logger: Logger = new Logger(0xF, "");
    const loggerMock: any = {
        error: () => Function.prototype,
        info: () => Function.prototype,
        log: () => Function.prototype,
    };

    const connectionConfig: ConnectionConfig = {
        database: "testdb",
        host: "123.123.123.123",
        password: "testpass",
        port: 1234,
        user: "testuser",
    };

    beforeEach(() => {
        applicationContainer = ApplicationContainer.getApplicationContainer();
        applicationContainer.setDbReadConnectionParameters(connectionConfig);
        applicationContainer.setDbWriteConnectionParameters(connectionConfig);
        applicationContainer.setLogger(loggerMock);
        applicationContainer.setMoment(moment);
    });

  describe("Success Scenarios", () => {
    it("Should return all messeges for given user", async () => {
      const promiseMySqlMock = new PromiseMySqlMock(
        "get-user-messages.yml",
        connectionConfig,
        logger,
      );
      spyOn(promiseMySqlMock, "mockEndConnection").and.callThrough();
      applicationContainer.setMysql(promiseMySqlMock);
      applicationContainer.composeDependencies();

      const mockAWSApiGatewayEvent: any = {
        httpMethod: "GET",
        pathParameters: {
          userId: "994",
        },
        resource: "/user/{userId}/messenger",
      };
      const response = await handler.handler(mockAWSApiGatewayEvent, null);

      const expectedResponseBody: any = JSON.stringify({
        messages: {
          '574': [
            {
              message: 'Hey how are you!',
              sentTime: "2021-03-19 16:36:10"
            },
            {
              message: 'Hey how are you!',
              sentTime: "2021-03-19 16:36:10"
            },
            {
              message: 'Hey how are you!',
              sentTime: "2021-03-19 16:36:10"
            },
          ],
          '7455': [
            {
              message: 'Hey how are you?',
              sentTime: "2021-03-19 16:36:10"
            },
            {
              message: 'Hey how are you?',
              sentTime: "2021-03-19 16:36:10"
            },
            {
              message: 'Hey how are you?',
              sentTime: "2021-03-19 16:36:10"
            },
          ]
        },
        size: 6
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers).toEqual({});
      expect(response.body).toEqual(expectedResponseBody);

      expect(promiseMySqlMock.mockEndConnection).toHaveBeenCalled();
    });

    it("Should return all messeges for given user with specific sender", async () => {
      const promiseMySqlMock = new PromiseMySqlMock(
        "get-user-messages-sender.yml",
        connectionConfig,
        logger,
      );
      spyOn(promiseMySqlMock, "mockEndConnection").and.callThrough();
      applicationContainer.setMysql(promiseMySqlMock);
      applicationContainer.composeDependencies();

      const mockAWSApiGatewayEvent: any = {
        httpMethod: "GET",
        pathParameters: {
          userId: "994",
        },
        resource: "/user/{userId}/messenger",
        queryStringParameters: {
          senderIds: "118",
          offset: "10",
          limit: "100",
        },
      };
      const response = await handler.handler(mockAWSApiGatewayEvent, null);

      const expectedResponseBody: any = JSON.stringify({
        messages: {
          '118': [
            {
              message: 'Hey how are you!',
              sentTime: "2021-03-19 16:36:10"
            },
            {
              message: 'Hey how are you!',
              sentTime: "2021-03-19 16:36:10"
            },
            {
              message: 'Hey how are you!',
              sentTime: "2021-03-19 16:36:10"
            },
          ]
        },
        size: 3
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers).toEqual({});
      expect(response.body).toEqual(expectedResponseBody);

      expect(promiseMySqlMock.mockEndConnection).toHaveBeenCalled();
    });

    it("Should save a message between sender and recipient", async () => {
      const promiseMySqlMock = new PromiseMySqlMock(
        "save-user-message.yml",
        connectionConfig,
        logger,
      );
      spyOn(promiseMySqlMock, "mockEndConnection").and.callThrough();
      applicationContainer.setMysql(promiseMySqlMock);
      applicationContainer.composeDependencies();

      const mockAWSApiGatewayEvent: any = {
        httpMethod: "POST",
        pathParameters: {
          userId: "994",
        },
        resource: "/user/{userId}/messenger",
        body: JSON.stringify({
          senderId: "963",
          message: "Hope your ok",
          sentTime: "2021-03-19 16:36:10",
        }),
      };
      const response = await handler.handler(mockAWSApiGatewayEvent, null);

      const expectedResponseBody = JSON.stringify({});

      expect(response.statusCode).toBe(201);
      expect(response.headers).toEqual({});
      expect(response.body).toEqual(expectedResponseBody);

      expect(promiseMySqlMock.mockEndConnection).toHaveBeenCalled();
    });
  });
});
