


import chai from 'chai';

const expect = chai.expect;
const assert = chai.assert;

import { clientsService } from './../services';
import { testData } from './test-data';

describe('Client Service', () => {
    
    it('test addClient()', async () => {
            let res =  await clientsService.add( testData.client );
            expect(res).to.have.property('name');

    });
});