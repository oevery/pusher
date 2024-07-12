import type { UndefinedPartialTelegramOptions } from '~/types'

/**
 * Default Telegram provider options
 * @description You must provide options and then can use env to override them
 */
export const defaultTelegramOptions: UndefinedPartialTelegramOptions = {
  token: undefined,
  chatId: undefined,
  messageThreadId: undefined,
  parseMode: undefined,
  linkPreviewOptions: {
    isDisabled: undefined,
  },
  disableNotification: undefined,
  protectContent: undefined,
}

export const defaults = {
  telegram: defaultTelegramOptions,
}
