import { Router } from 'express';
import { workerService } from '../services';
import { mwWorkerLocation, mwAddWorker } from './all.middleware';

const validator = require('express-joi-validation').createValidator({});

const router = Router();

// add Worker
router.post('/', validator.body(mwAddWorker), async (req, res) => {
  const params = req.body;
  try {
    const output = await workerService.add(params);
    return res.json({ status: true, data: output });
  } catch (error) {
    return res.json(error);
  }
});

// add Worker Location
router.post('/location', validator.body(mwWorkerLocation), async (req, res) => {
  const params = req.body;
  try {
    const output = await workerService.addLocation(params);
    return res.json({ status: true, data: output });
  } catch (error) {
    return res.json(error);
  }
});

export default router;
