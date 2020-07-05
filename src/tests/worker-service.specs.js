import chai from 'chai';

import { workerService } from '../services';
import { testData } from './test-data';

const { expect } = chai;

describe('Worker Service', () => {
  it('test addWorker()', async () => {
    const res = await workerService.add(testData.worker);
    expect(res).to.have.property('name');
  });
});
