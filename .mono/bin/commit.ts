import type { MonoSetupInternal } from 'mono'
import { readMonoSetup } from './mono'
import { cli } from './utils/cli'

export interface PullOptions {
    /**
     * @default false
     */
    verbose?: boolean
}

export async function commit(
    id?: string,
    options?: PullOptions,
    _setup?: MonoSetupInternal
): Promise<number> {
    try {
        const opts = {
            verbose: false,
            ...options
        }

        const setup = _setup ?? (await readMonoSetup())

        if (!id) {
            cli.info('Committing on all tracked entries...', 'green.bold').indent()

            cli.reset()

            let exitCode = 0

            for (const entry of setup._entriesMap.values()) {
                if (entry._meta.git === undefined) {
                    cli.item(
                        `Skipping "${entry._zone}/${entry.id}" because it is not git tracked.`,
                        'gray'
                    )
                }

                const code = await commit(entry.id, opts, setup)

                if (code !== 0) {
                    exitCode = code
                    break
                }
            }

            return exitCode
        }
        const entry = setup._entriesMap.get(id)

        if (!entry) {
            cli.error(`Entry with the identifier "${id}" could not be found.`)
            cli.reset()
            return 1
        }

        // make sure the entry path exists
        const folder = entry._path

        cli.indent().item(`${entry._zone}/${entry.id}`, 'white.bold').indent()

        cli.reset()

        return 0
    } catch (e: unknown) {
        cli.handleError(e)
        return 1
    }
}
