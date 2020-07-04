import { Router } from 'express';
import moment_tz from 'moment-timezone';
import { sitesService } from "./../services";
import queue from './../config/agenda';
import { MW_addSite } from './all.middleware';
const validator = require('express-joi-validation').createValidator({})

let router = Router()

// add Site
router.post('/', validator.body(MW_addSite), async function(req, res){
    let params = req.body;
    try {
        const output = await sitesService.add( params );
        return res.json({status: true, data: output})  
    } catch (error) {
        return res.json(error)
    }
});

// get Sites
router.get('/', async function(req, res){
    try {
        const output = await sitesService.find(  );
        return res.json({status: true, data: output})  
    } catch (error) {
        return res.json(error)
    }
});

// stats of site
router.get('/dailystats', async function(req, res, next){
    try {
        const output = await sitesService.findWorkerStats(moment_tz(), '5efd90aa506018306d2e1970'  );
        return res.json({status: true, data: output })  
    } catch (error) {
        console.log(error)
        return res.json(error)
    }
});

// Refresh queues
router.get('/refresh-queues', async function(req, res){
    try {
        const numRemoved = await queue.cancel({name: 'getSiteStats'});

        console.log('removed  jobs ',numRemoved)
        const output = await sitesService.find( );
        output.map(async obj=> {
            let reportTime = sitesService.findMidnightofSiteTimeZone( obj.timezone );
            let job = queue.create('getSiteStats', {site_id: obj._id, email: obj.email});
            job.repeatAt( reportTime , {
                skipImmediate: true
            });
            job.save();
            
        })
        return res.json({status: true, data: output})  
    } catch (error) {
        console.log(error)
        return res.json(error)
    }
});

    
export default router;