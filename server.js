require("dotenv").config();
const { createApp } = require("./app");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

createApp().listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});