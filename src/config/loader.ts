import { loadConfig } from 'c12'
import { klona } from 'klona'
import type { EnvOptions } from '~/utils/env'
import { applyEnv } from '~/utils/env'
import { defaults } from '~/config/defaults'
import type { PusherConfig } from '~/types'

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
    defaults: defaults as PusherConfig,
  })

  const config = klona(result.config)

  applyEnv(config, envOptions)

  return config
}
