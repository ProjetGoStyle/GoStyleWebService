const express = require("express");
const fs = require("fs");

const app = express();

app.get("/root", (req: any, resp: any) => {
  console.log(resp);
});

app.listen(3000);
