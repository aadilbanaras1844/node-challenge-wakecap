


import chai from 'chai';

const expect = chai.expect;
const assert = chai.assert;

import { clientsService, sitesService } from './../services';
import { testData } from './test-data';

describe('Site Service', () => {
    
    it('test addSite()', async () => {
        let res =  await clientsService.add( testData.client );
        expect(res).to.have.property('_id');
        
        let site = testData.site;
        site.client_id = res._id;
        
        let output = await sitesService.add(site);
        expect(output).to.have.property('_id');

    });
});