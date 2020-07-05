import momentTz from 'moment-timezone';

import { workerModel, workerLocationModel } from '../models';

export default class SiteService {
  async add(params) {
    try {
      const newObject = new workerModel(params);
      return await newObject.save();
    } catch (error) {
      return error;
    }
  }

  async addLocation({
    coordinates, is_active, duration, worker_id,
  }) {
    try {
      const newObject = new workerLocationModel({
        coordinates,
        is_active,
        duration,
        worker_id,
        added_date: momentTz().toDate(),
      });
      return await newObject.save();
    } catch (error) {
      return error;
    }
  }
}
