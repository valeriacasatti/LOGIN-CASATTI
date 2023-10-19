import { chatModel } from "./models/chat.model.js";

export class ChatManagerMongo {
  constructor() {
    this.model = chatModel;
  }

  //get messagges
  async getMessages() {
    try {
      const result = await this.model.find();
      return result;
    } catch (error) {
      console.log(`get messagges error: ${error.message}`);
      throw new Error(`get messagges error: ${error.message}`);
    }
  }

  //add messagge
  async addMessage(data) {
    try {
      const result = await this.model.create(data);
      return result;
    } catch (error) {
      console.log(`add messagge error: ${error.message}`);
      throw new Error(`add messagge error: ${error.message}`);
    }
  }
}
