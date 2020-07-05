import { clientModel } from '../models';

// const { ObjectId } = require('mongoose').Types;

export default class ClientService {
  async add(params) {
    try {
      // eslint-disable-next-line new-cap
      this.newObject = new clientModel(params);
      return await this.newObject.save();
    } catch (error) {
      return error;
    }
  }

  async find() {
    try {
      this.rows = await clientModel.find();
      return this.rows;
    } catch (error) {
      return error;
    }
  }
}
