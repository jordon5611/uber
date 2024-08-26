const nats = require('node-nats-streaming');

class NatsWrapper {
  constructor() {
    this._client = null;
  }

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting.");
    }
    return this._client;
  }

  connect(clusterId, clientId, urlString) {
    this._client = nats.connect(clusterId, clientId, { url: urlString });

    return new Promise((resolve, reject) => {
      this._client.on('connect', () => {
        console.log('Connected to NATS');
        resolve('Connected');
      });

      this._client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

const natsWrapper = new NatsWrapper();

module.exports = { natsWrapper };
