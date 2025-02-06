import { Response } from 'express';
import {js2xml} from 'xml-js'

class ResponseModel<T> {
    status: number;
    message: string;
    data?: T;

    constructor(status: number, message: string, data?: T) {
        this.status = status;
        this.message = message;
        if (data) this.data = data;
    }

    static send<T>(res: Response, status: number, message: string, data?: T): Response {
        const responseModel = new ResponseModel(status, message, data);
        const acceptHeader = res.req.headers['accept'];

        switch (acceptHeader) {
            case 'application/xml':
                res.setHeader('Content-Type', 'application/xml');
                const xmlString = js2xml({ response: responseModel }, { compact: true, spaces: 4 });
                return res.status(status).send(xmlString);

            case 'text/html':
                res.setHeader('Content-Type', 'text/html');
                return res.status(status).send(
                    `<html><body><h1>${status} - ${message}</h1><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`
                );

            case 'text/plain':
                res.setHeader('Content-Type', 'text/plain');
                return res.status(status).send(`${status} - ${message}\n${JSON.stringify(data, null, 2)}`);

            default:
                res.setHeader('Content-Type', 'application/json');
                return res.status(status).json(responseModel);
        }
    }
}

export default ResponseModel;
