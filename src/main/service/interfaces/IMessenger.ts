export interface IMessengerResponse {
  messages: {
    [key: string]: IMessengerResponseBody[];
  }
  size: number;
}

export interface IMessengerResponseBody {
  message: string;
  sentTime: string
}

export interface IMessenger {
  id?: number;
  recipientId?: number;
  senderId?: number;
  message?: string;
  sentTime?: string;
  readTime?: string;
  receivedTime?: string;
  created?: string;
  lastUpdated?: string;
}

export interface IMessengerGetSQL {
  id?: number;
  recipient_id?: number;
  sender_id?: number;
  message?: string;
  sent_time?: string;
  read_time?: string;
  received_time?: string;
  created?: string;
  last_updated?: string;
}
