import { clientModel } from '../models';

// const { ObjectId } = require('mongoose').Types;

export default class ClientService {
  async add(params) {
    try {
      const newObject = new clientModel(params);
      return await newObject.save();
    } catch (error) {
      return error;
    }
  }

  async find() {
    try {
      const rows = await clientModel.find();
      return rows;
    } catch (error) {
      return error;
    }
  }
}
