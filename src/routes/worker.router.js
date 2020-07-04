import { Router } from 'express';
import { workerService } from "./../services";
import { MW_workerLocation, MW_addWorker } from './all.middleware';
const validator = require('express-joi-validation').createValidator({})

let router = Router()

// add Worker
router.post('/', validator.body(MW_addWorker), async function(req, res){
    let params = req.body;
    try {
        const output = await workerService.add( params );
        return res.json({status: true, data: output})  
    } catch (error) {
        return res.json(error);
    }
});

// add Worker Location
router.post('/location', validator.body(MW_workerLocation), async function(req, res){
    let params = req.body;
    try {
        const output = await workerService.addLocation( params );
        return res.json({status: true, data: output})  
    } catch (error) {
        return res.json(error)
    }
});


    
export default router;