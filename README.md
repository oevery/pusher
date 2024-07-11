# pusher

A simple pusher. You can use this project to send message to multiple platforms with unify simple API.

**Work in Progress!!!**

## Supported platforms

- [x] telegram

## Installation

```bash
pnpm add @oevery/pusher
```

## Usage

```ts
import { TelegramProvider } from '@oevery/pusher'

const telegram = await TelegramProvider.create()

telegram.send('this is a test message.')
```

## Config

1. You can use `pusher.config.{js|ts}` to define pusher options.
2. Use environment like `PUSHER_TELEGRAM_TOKEN`.
3. Add options when create.

**High-priority parameters will override low-priority parameters.**
