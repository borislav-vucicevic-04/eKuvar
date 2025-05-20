import config from "./config/config";
import app from "./app";

app.listen(config.APP_PORT, () => {
  console.log(`Hello, application server is running on port ${config.APP_PORT}.`);
  
})