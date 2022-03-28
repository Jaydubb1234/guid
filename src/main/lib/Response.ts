import { DTO } from "../dto/DTO";

export class Response {
    public statusCode: number;
    public headers: any;
    public body: string;

    constructor(statusCode: number, headers: any, dto: any) {
        this.statusCode = statusCode;
        this.headers = headers;

        if (dto instanceof DTO) {
            this.body = dto.jsonSerialize();
        } else {
            this.body = JSON.stringify(dto);
        }
    }
}
