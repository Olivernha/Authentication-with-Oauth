const express = require("express");
const helmet = require("helmet");

const PORT = 3000;

const app = express();

app.use(helmet());
app.use
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
