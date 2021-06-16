const core = require('@actions/core');
const smartAssemblyDefaultVersion = '7.5.2.4508';

class Config {
    constructor()
    {
        this.connection_string = '';
        this.db_server = '';
        this.serial_number = '';
        this.version = smartAssemblyDefaultVersion;
    }
}

module.exports = {

    Config: Config,

    loadConfigFromInputs: function() {
        cfg = new Config;
        cfg.connection_string = core.getInput("connectionstring");
        cfg.db_server = core.getInput("db-server");
        cfg.serial_number = core.getInput("serial-number");
        cfg.version = core.getInput("version");
        if (cfg.version === null) {
            cfg.version = smartAssemblyDefaultVersion;
        }
        return cfg;
    }
}
