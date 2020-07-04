
import Agenda from 'agenda';
import moment from 'moment';

import { mongoUrl } from './load-parameters';

const agenda = new Agenda({db: {address: mongoUrl}});

import { sitesService, emailService } from './../services'

agenda.define('getSiteStats', async (job, done) => {
    const data = job.attrs.data;
    let stats = await sitesService.findWorkerStats(moment(), data.site_id);
    emailService.sendMail(data.email, stats);
    done();
});   

(async function() {
  await agenda.start();
})();

export default agenda;