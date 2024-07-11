import type * as z from 'zod'

export abstract class BaseProvider {
  abstract name: string
  abstract options: any
  abstract schema: z.Schema<typeof this.options>
  /**
   * Validate options
   */
  validator() {
    const { success, error } = this.schema.safeParse(this.options)
    if (!success) {
      const message = error.issues.map((issue) => { return `${issue.path.join(', ')} ${issue.message}` }).join('\n')
      throw new Error(`Invalid ${this.name} options:\n${message}`)
    }
  }
  /**
   * Send message
   * @param args
   */
  abstract send(...args: any): Promise<{ ok: boolean, data: any, msg: string }>
}
