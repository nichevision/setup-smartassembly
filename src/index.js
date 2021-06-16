var argv = require('minimist')(process.argv.slice(2));
const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const pathlib = require('path');
const cfg = require("./config");

const SA_VAR = "SA_SETUP";

async function runScript(scriptName, args) {
    const powershellPath = await io.which('powershell', true);
    let escapedScript = pathlib
        .join(__dirname, '..', 'scripts', scriptName)
        .replace(/'/g, "''");

    let argStr = ``;
    for (var opt in args) {
        argStr += `-${opt} '${args[opt]}' `;
    }

    const command = `& '${escapedScript}' ${argStr}`;
    console.log(command);

    const options = {};
    let processError = null;
    try
    {
        await exec.exec(
            `"${powershellPath}"`,
            [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                command
            ],
            options
        );
    }
    catch (error)
    {
        processError = error;
    }
    if (processError) {
        core.setFailed(processError);
    }
}

async function setup(config)
{
    runScript(
        'Setup-SmartAssembly.ps1',
        {
            SerialNumber: config.serial_number,
            ConnectionString: config.connection_string,
            DbServer: config.db_server,
            Version: config.version
        }
    );
    core.exportVariable(SA_VAR, "1");
}

async function deactivate() {
    runScript(
        'Deactivate-SmartAssembly.ps1'
    )
    core.exportVariable(SA_VAR, "0");
}

if (process.env[SA_VAR] === "1") {
    deactivate();
}
else {
    let config = cfg.loadConfigFromInputs();

    core.setSecret(config.serial_number);
    core.setSecret(config.db_server);
    core.setSecret(config.connection_string);

    setup(config);
}
