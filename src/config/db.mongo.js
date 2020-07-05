import {
  connect,
} from 'mongoose';

import {
  mongoUrl,
} from './load-parameters';

const connectDb = () => connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => true)
  .catch(() => false);
export default connectDb;
