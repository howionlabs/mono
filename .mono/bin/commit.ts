import { INDICATES_TRACKING_ACTION_NAME, type MonoSetupInternal } from 'mono'
import { monoSetupPath } from './mono'
import { cli } from './utils/cli'

export interface PullOptions {
    /**
     * @default false
     */
    verbose?: boolean
}

export async function commit(id?: string, options?: PullOptions): Promise<number> {
    try {
        const opts = {
            verbose: false,
            ...options
        }

        const setup: MonoSetupInternal = await import(monoSetupPath).then(m => m.default)

        if (!id) {
            cli.info('Committing on all tracked entries...', 'green.bold').indent()

            cli.reset()

            let exitCode = 0

            for (const entry of setup._entries) {
                if (
                    entry._actions.find(a => a.name === INDICATES_TRACKING_ACTION_NAME) ===
                    undefined
                ) {
                    cli.warn(`Skipping ${entry.id} because it is not tracked`, 'yellow.bold')
                }

                const code = await commit(entry.id, opts)

                if (code !== 0) {
                    exitCode = code
                    break
                }
            }

            return exitCode
        }
        const entry = setup._entries.find(e => e.id === id)

        if (!entry) {
            cli.error(`Entry with the identifier "${id}" could not be found.`)
            cli.reset()
            return 1
        }

        // make sure the entry path exists
        const folder = entry._path
        const linkablePath = `${entry._type}s/${entry.id}`

        cli.indent().item(linkablePath, 'white.bold').indent()

        cli.reset()

        return 0
    } catch (e: unknown) {
        cli.handleError(e)
        return 1
    }
}
