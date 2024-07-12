import type { PartialDeep, UndefinedOnPartialDeep } from 'type-fest'

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

export type UndefinedPartialTelegramOptions = UndefinedOnPartialDeep<PartialDeep<TelegramOptions>>
