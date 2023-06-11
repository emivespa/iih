# iih - irc client

![image](https://github.com/emivespa/iih/assets/82109173/a37cd418-2c1f-4e8c-9069-557f9e8f1aea)

## Dependencies

- [`ii`](https://tools.suckless.org/ii/) - from suckless.org

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
  - [ ] nicks with NickServ
- [x] fix scroll flicker
- [x] fix spacing bug
- [ ] fix ChatInput flicker
      requires fixing ink-text-input's UncontrolledTextInput
- [x] clean up code
