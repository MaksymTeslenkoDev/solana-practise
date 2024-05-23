const { CreateToken } = require('./createToken.private');

module.exports = () =>
  class extends CreateToken {
    constructor() {
      super();
    }
    async getSigners() {
      return undefined
    }
  };
