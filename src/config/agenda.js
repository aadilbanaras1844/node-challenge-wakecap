import Agenda from 'agenda';
import moment from 'moment';

import { mongoUrl } from './load-parameters';

import { sitesService, emailService } from '../services';

const agenda = new Agenda({ db: { address: mongoUrl } });

agenda.define('getSiteStats', async (job, done) => {
  const { data } = job.attrs;
  const stats = await sitesService.findWorkerStats(moment(), data.site_id);
  emailService.sendMail(data.email, stats);
  done();
});

const start = async () => {
  await agenda.start();
};
start();

export default agenda;
