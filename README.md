# iih - irc client

## Dependencies

* [`ii`](https://tools.suckless.org/ii/) - from suckless.org

## Install

```bash
git clone https://github.com/emivespa/iih
cd iih
npm run build
```

## CLI

```
$ iih --help

  Usage
    $ iih --host $host --channel $channel

  Options
    --host your.host
    --channel '#channel'

  Examples
    $ iih --host irc.libera.chat --channel '##spam'
```

## Roadmap

- [ ] custom nicks
- [X] fix scroll flicker
- [ ] fix ChatInput flicker
  - [ ] fix upstream ink-text-input UncontrolledTextInput bug?
- [ ] clean up code
