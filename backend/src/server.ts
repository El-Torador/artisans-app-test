import { server } from "./app";
import connectToDB from "./config/db";
import env from './config/configEnv';

const port = env.app.PORT

async function startServer(): Promise<void> {
  await connectToDB();
  server.listen(port, () => {
    console.log("listening on port " + port);
  })
}

startServer()
