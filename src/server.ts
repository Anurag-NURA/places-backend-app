import app from "./app.ts";
import config from "./config/config.ts";

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
