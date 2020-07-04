

import { clientModel } from "../models";
const ObjectId = require('mongoose').Types.ObjectId;

export default  class ClientService {
    constructor() {}

    async add( params ) {
        try {
            let newObject = new clientModel( params );  
            return await newObject.save();
        } catch (error) {
            return error;
        }
    }

    async find( params = {} ) {
        try {
            let rows = await clientModel.find();
            return rows;
        } catch (error) {
            return error;
        }
    }

}
