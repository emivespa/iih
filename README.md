# iih - ink & ii based irc client

![image](https://github.com/emivespa/iih/assets/82109173/a37cd418-2c1f-4e8c-9069-557f9e8f1aea)

## CLI

```
$ iih --help

  Usage
    $ iih

  Options
    --host your.host
    --channel '#yourchannel'
    --nick yournick
    --pass yourpass

  Examples
    $ iih --host irc.libera.chat --channel '#libera' --nick minime --pass fbf7946x
```

## Dependencies

- [`ii`](https://tools.suckless.org/ii/) - from suckless.org

## TODO

- [x] custom nicks
  - [x] nicks with NickServ
- [x] fix scroll flicker
- [x] fix spacing bug
- [ ] fix ChatInput flicker
  - requires upstream fix: ink-text-input's UncontrolledTextInput
