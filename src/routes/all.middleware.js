const { func } = require("joi");

import Joi from 'joi';

const MW_addSite = Joi.object({
    name: Joi.string().required(),
    client_id: Joi.string().required(),
    timezone: Joi.string().required().regex(/^([+|-][0-9]{2})\:([0-9]{2})$/),
    starting_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
    ending_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
    late_threshold: Joi.number().required(),
    email: Joi.string().required().email(),
})

const MW_addWorker = Joi.object({
    name: Joi.string().required(),
    worker_id: Joi.number().required(),
    site_id: Joi.string().required(),
})

const MW_workerLocation = Joi.object().keys({
    coordinates: Joi.object().keys({
      _id: Joi.string().required(),
      type: Joi.string().required(),
      coordinates: Joi.array()
    }),
    is_active: Joi.boolean().required(),
    duration: Joi.number().required(),
    worker_id: Joi.number().required(),

  });

export {
    MW_addSite,
    MW_addWorker,
    MW_workerLocation
}
