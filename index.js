const express = require("express");
const APP = express();
const PORT = 3000;
const SHELLEX = require("shelljs");
const myJson = require("./core/config.json");
const core = require("./core/core");

//Initialization Sequence
const REPOURL = myJson.config.repository;
let status = myJson.config.status;

function Initialization() {
  check.Check("Shell");
  check.Check("Git");
  check.Check("VPN");
  check.Done();
}
if (!status.init) {
  Initialization();
}

setInterval(() => {
  check.Check("VPN");
}, 1800000);

let branch = "master";
APP.get("/", (req, res) => {
  res.send(
    `Status: \n Shell:${status.shell} \nGit:${status.git} \nVPN:${status.vpn}`
  );
  if (!SHELLEX.error(SHELLEX.exec(`git checkout ${branch}`))) {
    branch = "performance";
    SHELLEX.exec(`git status`);
  } else {
    SHELLEX.echo("Error while checking out");
    SHELLEX.exec("git status");
  }
});
APP.get("/status", (req, res) => {
  res.json(status);
});
APP.get("/shutdown", (req, res) => {
  check.Shutdown();
  res.json("System going down");
  SHELLEX.echo("System going down");
  SHELLEX.exit(1);
});

APP.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
  SHELLEX.echo(
    `Available Services:\n Shell: ${status.shell}\n Git: ${status.git}\n VPN: ${status.vpn}`
  );
});
