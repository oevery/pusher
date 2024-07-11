import { defu } from 'defu'
import type { PartialDeep, SnakeCasedPropertiesDeep, UndefinedOnPartialDeep } from 'type-fest'
import { ofetch } from 'ofetch'
import * as changeKeys from 'change-case/keys'
import * as R from 'ramda'
import * as z from 'zod'
import { loadPusherConfig } from '~/config/loader'
import { BaseProvider } from '~/provider'

/**
 * Telegram provider options
 * @url https://core.telegram.org/bots/api#sendmessage
 */
export interface TelegramOptions {
  /**
   * Telegram bot token
   * @example
   * '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
   */
  token: string
  /**
   * Telegram chat ID
   * @example
   * 123456789
   * @example
   * '-123456789'
   * @example
   * '@channelusername'
   */
  chatId: number | string
  /**
   * Telegram message thread ID
   * @example
   * 1
   */
  threadId?: number
  /**
   * Telegram message parse mode
   * @url https://core.telegram.org/bots/api#formatting-options
   */
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown'
  /**
   * Telegram link preview generation options for the message
   * @url https://core.telegram.org/bots/api#linkpreviewoptions
   */
  linkPreviewOptions?: {
    /**
     * Disables link previews for links in this message
     * @default false
     */
    isDisabled?: boolean
    /**
     * URL to use for the link preview. If empty, then the first URL found in the message text will be used
     */
    url?: string
    preferSmallMedia?: boolean
    preferLargeMedia?: boolean
    /**
     * link preview must be shown above the message text
     */
    showAboveText?: boolean
  }
  /**
   * Disables notification for the message
   */
  disableNotification?: boolean
  /**
   * Protects the contents of the sent message from forwarding and saving
   */
  protectContent?: boolean
}

/**
 * Telegram zod schema
 */
export const telegramSchema: z.ZodType<TelegramOptions> = z.object({
  token: z.string(),
  chatId: z.union([z.string(), z.number()]),
  threadId: z.number().optional(),
  parse_mode: z.union([z.literal('MarkdownV2'), z.literal('HTML'), z.literal('Markdown')]).optional(),
  linkPreviewOptions: z.object({
    isDisabled: z.boolean().optional(),
    url: z.string().optional(),
    preferSmallMedia: z.boolean().optional(),
    preferLargeMedia: z.boolean().optional(),
    showAboveText: z.boolean().optional(),
  }).optional(),
  disableNotification: z.boolean().optional(),
})

export type UndefinedPartialTelegramOptions = UndefinedOnPartialDeep<PartialDeep<TelegramOptions>>

/**
 * Default Telegram provider options
 * @description You must provide options and then can use env to override them
 */
export const defaultTelegramOptions: UndefinedPartialTelegramOptions = {
  token: undefined,
  chatId: undefined,
  threadId: undefined,
  parse_mode: undefined,
  linkPreviewOptions: {
    isDisabled: undefined,
  },
  disableNotification: undefined,
  protectContent: undefined,
}

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
