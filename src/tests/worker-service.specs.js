


import chai from 'chai';

const expect = chai.expect;
const assert = chai.assert;

import { workerService } from './../services';
import { testData } from './test-data';

describe('Worker Service', () => {
    
    it('test addWorker()', async () => {
            let res =  await workerService.add( testData.worker );
            expect(res).to.have.property('name');
    });

});