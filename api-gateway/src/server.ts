import app from "./app/app";
import config from "./config/config";
import logger from "./config/logger";

const { host,port } = config.getServerConfig();
app.listen(port, host, () => {
  logger.info(`Server listening at http://${host}:${port}`)
})