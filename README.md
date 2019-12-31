# polkadot-checker

This tool helps checking general on-chain data. Currently it supports querying
block authors and events.

## Usage

```shell
$ git clone https://github.com/w3f/polkadot-checker.git
$ cd polkadot-checker
$ yarn
$ cp config/main.sample.yaml config/main.yaml

# configure config/main.yaml

$ yarn start
```

## Configuration
You have an example configuration in [config/main.sample.yaml](https://github.com/w3f/polkadot-checker/blob/master/config/main.sample.yaml). The main fields
in the configuration file are:

* `endpoint`: polkadot websockets endpoint to connect to.
* `checks`: configuration for the checks to be performed, it includes:
  * `authoredBlocks`: configuration for checking block authorship:
    * `start`: initial block to check.
    * `end`: last block to check.
    * `author`: validator account to look for.
  * `events`:
    * `start`: initial block to check.
    * `end`: last block to check.
    * `section`: event section to look for.
    * `method`: event method to look for.
    * `match`: content in the event to match.
