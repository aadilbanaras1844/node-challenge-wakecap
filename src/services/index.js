
import moment from 'moment';

import ClientService from './client.service';
import SiteService from './site.service';
import WorkerService  from './worker.service';
import * as emailService from './email.service';

import connectDb from './../config/db.mongo';
connectDb();


const clientsService = new ClientService;
const sitesService = new SiteService;
const workerService = new  WorkerService;

export {
    clientsService,
    sitesService,
    workerService,
    emailService
}