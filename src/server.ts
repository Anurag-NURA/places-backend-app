import app from "./app.ts";
import config from "./config/config.ts";

import { checkConnection } from "./config/client.ts";

app.listen(config.PORT, async() => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
  await checkConnection();
});
