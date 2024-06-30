const config = require("../config");
const { Client } = require("pg");

let General = {
  postgreQuery: (queryString, callback) => {
    const client = new Client({
      user: config.pg.user,
      host: config.pg.host,
      database: config.pg.db,
      password: config.pg.pass,
      port: config.pg.port,
    });
    client.connect((err) => {
      if (err) {
        console.error(new Date().toISOString(), "connection error", err.stack);
      } else {
        client.query(queryString, (err, response) => {
          client.end();
          if (err) {
            console.log((new Date()).toISOString(),"JSON error",JSON.stringify(err));
          }
          callback(err, response);
        });
      }
    });
  },
  postgreConnect: (callback) => {
    const client = new Client({
      user: config.pg.user,
      host: config.pg.host,
      database: config.pg.db,
      password: config.pg.pass,
      port: config.pg.port,
    });
    client.connect((err) => {
      if (err) {
        console.error(new Date().toISOString(), "connection error", err.stack);
        callback(err.stack, null);
      } else {
        callback(null, client);
      }
    });
  },
  PrepareDbDataNulls: (value) => {
    if (value === 0) {
      return ", 0";
    } else if (!value || value == null) {
      if (typeof value === "boolean") {
        return ", " + value;
      } else {
        return ", null";
      }
    } else {
      if (typeof value === "boolean") {
        return ", " + value;
      } else if (typeof value === "string") {
        return ", '" + value.replace(/'/g, " ") + "'";
      } else {
        return ", '" + value + "'";
      }
    }
  },
};

module.exports = General;
