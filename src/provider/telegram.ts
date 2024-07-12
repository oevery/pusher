import { defu } from 'defu'
import type { SnakeCasedPropertiesDeep } from 'type-fest'
import { ofetch } from 'ofetch'
import * as changeKeys from 'change-case/keys'
import * as R from 'ramda'
import { loadPusherConfig } from '~/config/loader'
import { BaseProvider } from '~/provider'
import { telegramSchema } from '~/schema'
import type { TelegramOptions, UndefinedPartialTelegramOptions } from '~/types'

interface User {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
}

interface Chat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  first_name?: string
  last_name?: string
  is_forum?: true
}

/**
 * Telegram Send Message Fetch result
 * @url https://core.telegram.org/bots/api#sendmessage
 */
interface TelegramSendMessageResult {
  ok: boolean
  result: {
    message_id: number
    message_thread_id?: number
    from?: User
    chat: Chat
    date: number
    text: string
  }
  error_code?: number
  description?: string
}

export class TelegramProvider extends BaseProvider {
  name = 'telegram'
  declare options: TelegramOptions
  schema = telegramSchema

  private constructor() { super() }

  static async create(options?: UndefinedPartialTelegramOptions) {
    const { telegram: defaults } = await loadPusherConfig()
    const _options = defu(options, defaults)

    const instance = new TelegramProvider()
    instance.options = _options as TelegramOptions
    instance.validator()

    return instance
  }

  async send(text: string) {
    const params = R.omit(['token'], this.options)
    const snakeCaseParams = changeKeys.snakeCase(params, 3) as SnakeCasedPropertiesDeep<typeof params>
    const res = await ofetch<TelegramSendMessageResult>(`https://api.telegram.org/bot${this.options.token}/sendMessage`, {
      method: 'POST',
      body: {
        text,
        ...snakeCaseParams,
      },
      ignoreResponseError: true,
    })
    if (!res.ok) {
      throw new Error(`Telegram send message failed: ${res.description || res.error_code}`)
    }
    return {
      ok: true,
      data: res.result,
      msg: 'success',
    }
  }
}
