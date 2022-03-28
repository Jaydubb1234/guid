export const messengerSchema = {
  additionalProperties: false,
  properties: {
      senderId: {
          type: "string",
      },
      message: {
          type: "string",
      },
      sentTime: {
          type: "string",
      },
  },
  required: [
      "senderId",
      "message",
      "sentTime",
  ],
  type: "object",
};
