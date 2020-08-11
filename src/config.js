const core = require('@actions/core');

class Config {
    constructor()
    {
        this.connection_string = '';
        this.db_server = '';
        this.serial_number = '';
    }
}

module.exports = {

    Config: Config,

    loadConfigFromInputs: function() {
        cfg = new Config;
        cfg.connection_string = core.getInput("connectionstring");
        cfg.db_server = core.getInput("db-server");
        cfg.serial_number = core.getInput("serial-number");
        return cfg;
    }
}
