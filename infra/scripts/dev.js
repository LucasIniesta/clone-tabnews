const { spawn } = require("child_process");

function run(command, args) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: "inherit", shell: true });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Processo finalizou com código: ${code}`));
      }
    });

    process.on("error", (err) => reject(err));
  });
}

async function cleanUp() {
  console.log("Parando serviços");
  const stopProcess = spawn("npm", ["run", "services:stop"], {
    stdio: "inherit",
    shell: true,
  });
  stopProcess.on("close", () => process.exit());
}

async function start() {
  try {
    process.on("SIGINT", cleanUp);
    process.on("SIGTERM", cleanUp);

    console.log("Começando serviços");

    await run("npm", ["run", "services:up"]);
    await run("npm", ["run", "services:wait:database"]);
    await run("npm", ["run", "migrations:up"]);

    console.log("Iniciando Next");
    await run("next", ["dev"]);
  } catch (error) {
    console.error("Erro na inicialização:", error);
    process.exit(1);
  } finally {
    cleanUp();
  }
}

start();
