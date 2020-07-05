import chai from 'chai';
import * as config from '../config/load-parameters';
import connectDb from '../config/db.mongo';

const { expect } = chai;
const { assert } = chai;

describe('DB test', () => {
  it('Should have mongo URI', () => {
    assert.typeOf(config.mongoUrl, 'string');
  });
  it('MongoDB should cocnnect', async () => {
    const res = await connectDb();
    expect(res).to.be.true;
  });
});
