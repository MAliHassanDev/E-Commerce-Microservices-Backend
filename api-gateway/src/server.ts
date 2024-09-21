import app from "./app/app.ts";
import config from "./config/config.ts";
import logger from "./config/logger.ts";

const { host,port } = config.getServerConfig();
app.listen(port, host, () => {
  logger.info(`Server listening at http://${host}:${port}`)
})