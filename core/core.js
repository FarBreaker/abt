const fs = require("fs");
const SHELLEX = require("shelljs");
const setting = require("./config.json");

function test() {
  setting.config.repository.name = "prova";
  fs.writeFileSync("./core/config.json", JSON.stringify(setting));
  console.log(setting);
}

function Check(component) {
  switch (component) {
    case "Shell":
      if (!SHELLEX.which("zsh")) {
        SHELLEX.echo(
          "zsh not found, this script requires a normodotated shell env, checking if bash is OK..."
        );
      } else if (!SHELLEX.which("bash")) {
        SHELLEX.echo(
          "bash not found, as i already said this script requires normodotated shell env, aborting ..."
        );
        setting.config.status["shell"] = false;
        SHELLEX.exit();
      } else {
        setting.config.status["shell"] = true;
        SHELLEX.echo("Shell env correctly set, proceding checks...");
      }
      break;
    case "Git":
      if (!SHELLEX.which("git")) {
        SHELLEX.echo("Git not found, this script require git");
        setting.config.status["git"] = false;
        SHELLEX.exit(0);
      } else {
        setting.config.status["git"] = true;
        SHELLEX.echo("Git found...");
      }
      break;
    case "VPN":
      if (
        SHELLEX.error(
          SHELLEX.exec(`curl ${setting.config.repository.url}`, {
            silent: true,
          })
        )
      ) {
        setting.config.status["vpn"] = false;
        SHELLEX.echo(
          "Repository unreachable, please check you connection to internet and/or to the VPN"
        );
      } else {
        setting.config.status["vpn"] = true;
        SHELLEX.echo("Connection established proceding...");
      }
    default:
      break;
  }
}

function Done() {
  setting.config.status.init = true;
  fs.writeFileSync("./core/config.json", JSON.stringify(setting));
}
function Shutdown() {
  setting.config.status.init = false;
  setting.config.status.git = false;
  setting.config.status.vpn = false;
  setting.config.status.shell = false;
  fs.writeFileSync("./core/config.json", JSON.stringify(setting));
}

exports.test = test;
exports.Done = Done;
exports.Check = Check;
exports.Shutdown = Shutdown;
