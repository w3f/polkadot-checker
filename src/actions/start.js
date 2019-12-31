const { Config } = require('../config')
const { Checker } = require('../checker')


module.exports = {
  do: async (cmd) => {
    const cfg = Config.parse(cmd.config)

    const checkerCfg = {
      endpoint: cfg.endpoint,
      check: cfg.check
    }
    const checker = new Checker(checkerCfg)
    await checker.start()
  }
}
