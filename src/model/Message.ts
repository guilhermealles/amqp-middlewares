interface MessageHeaders {
  [key: string]: string;
}

export class Message {
  payload: string;
  headers: MessageHeaders;

  constructor(payload: string, headers?: MessageHeaders) {
    this.payload = payload;
    this.headers = headers || {};
  }
}
