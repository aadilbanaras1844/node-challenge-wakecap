
import chai from 'chai';

const expect = chai.expect;
const assert = chai.assert;

import { sendMail } from './../services/email.service';


describe('Email Service', () => {
    it('test function sendMail()', async () => {
        try {
            let res =  await sendMail('adilbanaras@gmail.com', {data:'test data'});
            expect(res).to.be.undefined;
        } catch (error) {
            expect(error).to.be.true;
        }

    });
});