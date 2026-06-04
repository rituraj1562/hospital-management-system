import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason);
  process.exit(1);
});

await connectDatabase();

app.listen(env.port, () => {
  console.log(`HMS API running on port ${env.port}`);
});
