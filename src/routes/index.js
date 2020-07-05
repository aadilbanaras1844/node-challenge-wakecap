import clientRouter from './client.router';
import siteRouter from './site.router';
import workerRouter from './worker.router';

export default (app) => {
  app.use('/api/clients', clientRouter);
  app.use('/api/sites', siteRouter);
  app.use('/api/workers', workerRouter);

  // Error 404 Catch
  app.use((req, res) => res.status(404).send({ message: `Route${req.url} Not found.` }));
};
