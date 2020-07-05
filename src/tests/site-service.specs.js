import chai from 'chai';

import { clientsService, sitesService } from '../services';
import { testData } from './test-data';

const { expect } = chai;

describe('Site Service', () => {
  it('test addSite()', async () => {
    const res = await clientsService.add(testData.client);
    expect(res).to.have.property('_id');

    const { site } = testData;
    site.client_id = res._id;

    const output = await sitesService.add(site);
    expect(output).to.have.property('_id');
  });
});
