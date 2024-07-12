import * as z from 'zod'
import type { TelegramOptions } from '~/types'

/**
 * Telegram zod schema
 */
export const telegramSchema: z.ZodType<TelegramOptions> = z.object({
  token: z.string(),
  chatId: z.union([z.string(), z.number()]),
  messageThreadId: z.number().optional(),
  parseMode: z.union([z.literal('MarkdownV2'), z.literal('HTML'), z.literal('Markdown')]).optional(),
  linkPreviewOptions: z.object({
    isDisabled: z.boolean().optional(),
    url: z.string().optional(),
    preferSmallMedia: z.boolean().optional(),
    preferLargeMedia: z.boolean().optional(),
    showAboveText: z.boolean().optional(),
  }).optional(),
  disableNotification: z.boolean().optional(),
})
