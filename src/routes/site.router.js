import { Router } from 'express';
import momentTz from 'moment-timezone';
import { sitesService } from '../services';
import queue from '../config/agenda';
import { mwAddSite } from './all.middleware';

const validator = require('express-joi-validation').createValidator({});

const router = Router();

// add Site
router.post('/', validator.body(mwAddSite), async (req, res) => {
  const params = req.body;
  try {
    const output = await sitesService.add(params);
    return res.json({ status: true, data: output });
  } catch (error) {
    return res.json(error);
  }
});

// get Sites
router.get('/', async (req, res) => {
  try {
    const output = await sitesService.find();
    return res.json({ status: true, data: output });
  } catch (error) {
    return res.json(error);
  }
});

// stats of site
router.get('/dailystats', async (req, res) => {
  try {
    const output = await sitesService.findWorkerStats(momentTz(), '5efd90aa506018306d2e1970');
    return res.json({ status: true, data: output });
  } catch (error) {
    // console.log(error);
    return res.json(error);
  }
});

// Refresh queues
router.get('/refresh-queues', async (req, res) => {
  try {
    await queue.cancel({ name: 'getSiteStats' });

    // console.log('removed  jobs ', numRemoved);
    const output = await sitesService.find();
    output.map(async (obj) => {
      const reportTime = sitesService.findMidnightofSiteTimeZone(obj.timezone);
      // eslint-disable-next-line no-underscore-dangle
      const job = queue.create('getSiteStats', { site_id: obj._id, email: obj.email });
      job.repeatAt(reportTime, {
        // skipImmediate: true,
      });
      job.save();
    });
    return res.json({ status: true, data: output });
  } catch (error) {
    // console.log(error);
    return res.json(error);
  }
});

export default router;
