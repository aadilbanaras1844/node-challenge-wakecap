import chai from 'chai';

import { sendMail } from '../services/email.service';

const { expect } = chai;

describe('Email Service', () => {
  it('test function sendMail()', async () => {
    try {
      const res = await sendMail('adilbanaras@gmail.com', { data: 'test data' });
      expect(res).to.be.undefined;
    } catch (error) {
      expect(error).to.be.true;
    }
  });
});
