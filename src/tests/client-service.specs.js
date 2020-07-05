import chai from 'chai';

import { clientsService } from '../services';
import { testData } from './test-data';

const { expect } = chai;

describe('Client Service', () => {
  it('test addClient()', async () => {
    const res = await clientsService.add(testData.client);
    expect(res).to.have.property('name');
  });
});
