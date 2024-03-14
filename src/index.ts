import app from './app';
import config from './config';

app.listen(config.port, () => {
  console.log(`I am listening at http://localhost:${config.port}`);
});
