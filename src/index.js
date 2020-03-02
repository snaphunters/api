const PORT = 3000;
const app = require("./app");
require("./utils/db");

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server runnning on http://localhost:${PORT}`);
});
