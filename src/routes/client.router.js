import { Router } from 'express';
import { clientsService } from '../services';

const router = Router();

// add client
router.post('/', async (req, res) => {
  const params = req.body;
  try {
    const output = await clientsService.add(params);
    return res.json({ status: true, data: output });
  } catch (error) {
    return res.json(error);
  }
});

// get Clients
router.get('/', async (req, res) => {
  try {
    const output = await clientsService.find();
    return res.json({ status: true, data: output });
  } catch (error) {
    return res.json(error);
  }
});

export default router;
