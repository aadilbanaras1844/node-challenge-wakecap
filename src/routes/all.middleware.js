import Joi from 'joi';

const mwAddSite = Joi.object({
  name: Joi.string().required(),
  client_id: Joi.string().required(),
  timezone: Joi.string().required().regex(/^([+|-][0-9]{2}):([0-9]{2})$/),
  starting_time: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/),
  ending_time: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/),
  late_threshold: Joi.number().required(),
  email: Joi.string().required().email(),
});

const mwAddWorker = Joi.object({
  name: Joi.string().required(),
  worker_id: Joi.number().required(),
  site_id: Joi.string().required(),
});

const mwWorkerLocation = Joi.object().keys({
  coordinates: Joi.object().keys({
    _id: Joi.string().required(),
    type: Joi.string().required(),
    coordinates: Joi.array(),
  }),
  is_active: Joi.boolean().required(),
  duration: Joi.number().required(),
  worker_id: Joi.number().required(),

});

export {
  mwAddSite,
  mwAddWorker,
  mwWorkerLocation,
};
