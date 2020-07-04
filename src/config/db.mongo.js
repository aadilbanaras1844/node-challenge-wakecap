
import { connect } from 'mongoose';

import { mongoUrl } from './load-parameters';

let connectDb = function(){
    return connect( mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      } )
      .then(() => {
        // console.log("Connected to MongoDB...");
        return true;
      })
        .catch(err => {
          // console.error("Could not connect to MongoDB, exiting the application");
          return false;
      });
}
export default connectDb;