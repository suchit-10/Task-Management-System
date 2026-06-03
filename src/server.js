import app from './app.js';

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Task portal API running on port ${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. The API may already be running.`);
    process.exit(1);
  }

  console.error('Could not start the API server.');
  console.error(error.message);
  process.exit(1);
});
