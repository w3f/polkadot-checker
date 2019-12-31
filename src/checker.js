const { ApiPromise, WsProvider } = require('@polkadot/api')

const _ = require('lodash');

class Checker {
  constructor(cfg) {
    this.provider = new WsProvider(cfg.endpoint)
    this.check = cfg.check
  }

  async start() {
    await this._initAPI()

    if (this.check.authoredBlocks) {
      await this._checkAuthoredBlocks(this.check.authoredBlocks)
    }

    if (this.check.events) {
      await this._checkEvents(this.check.events)
    }

    this.api.disconnect()
  }

  async _initAPI() {
    this.api = await ApiPromise.create({ provider: this.provider })

    const [chain, nodeName, nodeVersion] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.name(),
      this.api.rpc.system.version()
    ])
    console.log(
      `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
    )
  }

  async _checkAuthoredBlocks(cfg) {
    let outputBlocks = [];
    for(let blockNumber = cfg.start; blockNumber <= cfg.end; blockNumber++) {
      console.log(`checking block authorship for ${blockNumber}...`)

      const hash = await this.api.rpc.chain.getBlockHash(blockNumber)

      const header = await this.api.derive.chain.getHeader(hash)
      const author = header.author
      if (author === cfg.author) {
        outputBlocks.push(blockNumber)
        console.log(`block ${blockNumber}, was authored by ${author}`)
      }
    }
    console.log(`Found ${outputBlocks.length} blocks authored by ${cfg.author} between ${cfg.start} and ${cfg.end}`)
  }

  async _checkEvents(cfg) {
    let outputEvents = [];
    for(let blockNumber = cfg.start; blockNumber <= cfg.end; blockNumber++) {
      console.log(`checking block events for ${blockNumber}...`)

      const hash = await this.api.rpc.chain.getBlockHash(blockNumber)
      const events = await this.api.query.system.events.at(hash)

      events.forEach((record) => {
        const { event, phase } = record
        const eventData = JSON.parse(JSON.stringify(event.data))
        if (event.section.replace(/['"]+/g, '') === cfg.section &&
            event.method.replace(/['"]+/g, '') === cfg.method &&
            _.isEqual(eventData, cfg.match.data)) {
          console.log(`event ${JSON.stringify(event)}`)
          outputEvents.push(event)
        }
      })
    }
    console.log(`Found ${outputEvents.length} events between ${cfg.start} and ${cfg.end}`)
  }
}

module.exports = {
  Checker
}
