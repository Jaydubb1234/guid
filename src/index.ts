import {ApplicationContainer} from "./main/dependencyInjection/ApplicationContainer";

export async function handler(event: any, context: any): Promise<any> {
    const applicationContainer: ApplicationContainer = ApplicationContainer.getApplicationContainer();
    applicationContainer.composeDependencies();

    const requestMapping = {
        "/user/{userId}/messenger": applicationContainer.getMessengerController(),
    };

    try {
        return requestMapping[event.resource][event.httpMethod](event, context);
    } catch (error) {
        applicationContainer
            .getLogger()
            .error(JSON.stringify({ ...event, ...error }));
        throw error;
    }
}
