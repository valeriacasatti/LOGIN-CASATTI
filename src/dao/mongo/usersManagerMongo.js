import { usersModel } from "./models/users.model.js";

export class UsersManagerMongo {
  constructor() {
    this.model = usersModel;
  }

  //add user
  async addUser(userInfo) {
    try {
      const result = await this.model.create(userInfo);
      if (
        userInfo.email == "adminCoder@coder.com" &&
        userInfo.password == "adminCod3r123"
      ) {
        userInfo.role = "admin";
      } else {
        userInfo.role = "user";
      }
      return result;
    } catch (error) {
      console.log(`add user error: ${error.message}`);
      throw new Error(`add user error: ${error.message}`);
    }
  }

  //get user
  async getUser(loginForm) {
    try {
      const result = await this.model.findOne({ email: loginForm.email });
      return result;
    } catch (error) {
      console.log(`get user error: ${error.message}`);
      throw new Error(`get user error: ${error.message}`);
    }
  }
}
