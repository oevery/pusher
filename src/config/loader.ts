import { loadConfig } from 'c12'
import { klona } from 'klona'
import type { EnvOptions } from '~/utils/env'
import { applyEnv } from '~/utils/env'
import type { TelegramOptions } from '~/provider'
import { defaultTelegramOptions } from '~/provider'

export interface PusherConfig {
  telegram: TelegramOptions
}

const envOptions: EnvOptions = {
  prefix: 'PUSHER_',
  envExpansion: true,
}

export async function loadPusherConfig(): Promise<PusherConfig> {
  const result = await loadConfig<PusherConfig>({
    name: 'pusher',
    configFile: 'pusher.config',
    rcFile: false,
    globalRc: false,
    dotenv: true,
    defaults: {
      telegram: defaultTelegramOptions as TelegramOptions,
    },
  })

  const config = klona(result.config)

  applyEnv(config, envOptions)

  return config
}
