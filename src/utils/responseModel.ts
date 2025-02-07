import { Response } from 'express';
import * as js2xmlparser from 'js2xmlparser';
import { jsonToPlainText } from 'json-to-plain-text';

class ResponseModel<T> {
  status: number;
  data?: T;

  constructor(status: number, data?: T) {
    this.status = status;
    if (data) this.data = data;
  }

  static send<T>(res: Response, status: number, data?: T): Response {
    const responseModel = new ResponseModel(status, data);
    const acceptHeader = res.req.headers['accept'];

    switch (acceptHeader) {
      case 'application/xml': {
        res.setHeader('Content-Type', 'application/xml');
        const xmlString = js2xmlparser.parse('response', responseModel);
        return res.status(status).send(xmlString);
      }

      case 'text/html':
        res.setHeader('Content-Type', 'text/html');
        return res
          .status(status)
          .send(
            `<html><body><h1>${status}</h1>${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ''}</body></html>`
          );

      case 'text/plain': {
        res.setHeader('Content-Type', 'text/plain');
        const plainText = jsonToPlainText(responseModel, { color: false });
        return res.status(status).send(plainText);
      }

      default:
        res.setHeader('Content-Type', 'application/json');
        return res.status(status).json(responseModel);
    }
  }
}

export default ResponseModel;
