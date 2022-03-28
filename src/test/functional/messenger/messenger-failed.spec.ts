import * as handler from "../../../index";
import {ApplicationContainer} from "../../../main/dependencyInjection/ApplicationContainer";
import {PromiseMySqlMock} from "../../mocks/promise-mysql/PromiseMySqlMock";
import {ConnectionConfig} from "promise-mysql";
import {Logger} from "../../../main/util/Logger";
import {Response} from "../../../main/lib/Response";
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

    describe("Failure Scenarios", () => {
      it("There was a MySQL error when attempting to open up a connection.", async () => {
          const mySqlMock = new PromiseMySqlMock(
              "get-user-messages.yml",
              connectionConfig,
              logger,
          );
          mySqlMock.createConnection = (async (): Promise<void> => {
              throw new Error("MOCK ERROR");
          }) as any;

          spyOn(loggerMock, "error").and.callThrough();

          applicationContainer.setMysql(mySqlMock);
          applicationContainer.setLogger(loggerMock);
          applicationContainer.composeDependencies();

          const mockAWSApiGatewayEvent:any = {
            httpMethod: "GET",
            pathParameters: {
              userId: "994",
            },
            resource: "/user/{userId}/messenger",
          };

          const response: any = await handler.handler(mockAWSApiGatewayEvent, null);
          const expectedResponse: Response = new Response(500, {},
              {
                  status: "error",
                  // tslint:disable-next-line:object-literal-sort-keys
                  message: "Unable to acquire MySQL connection.",
              },
          );
          const expectedLoggerMessage = {
              message: "Unable to acquire MySQL connection.",
              // tslint:disable-next-line:object-literal-sort-keys
              cause: {
                  message: "MOCK ERROR",
              },
          };

          expect(loggerMock.error)
              .toHaveBeenCalledWith(JSON.stringify({ ...mockAWSApiGatewayEvent, ...expectedLoggerMessage }));

          expect(expectedResponse).toEqual(response);
      });
    });
});
