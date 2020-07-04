
import moment_tz from 'moment-timezone';

import { workerModel, workerLocationModel } from "../models";
const ObjectId = require('mongoose').Types.ObjectId;

export default  class SiteService {
    constructor() {}

    async add( params ) {
        try {
            let newObject = new workerModel( params );  
            return await newObject.save();
        } catch (error) {
            return error;
        }
    }

    async addLocation({ coordinates, is_active, duration, worker_id }){
        try{
            let newObject = new workerLocationModel({
                coordinates, is_active, duration, worker_id,
                added_date: moment_tz().toDate()
            });  
            return await newObject.save();
        } catch( error ){
            return error;
        }
    }


}
