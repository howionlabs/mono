import type { MonoSetupInternal } from './types'
import { monoSetupPath } from './constants'
import { constructAndWriteEnvFiles } from './env'
import { cli } from './utils/cli'
import { absoluteToRelative, CWD, dirExists } from './utils/fs'

export interface RemoldOptions {
    /**
     * @default false
     */
    verbose?: boolean
}

export async function remold(id?: string, options?: RemoldOptions): Promise<number> {
    try {
        const opts = {
            verbose: false,
            ...options
        }

        const setup: MonoSetupInternal = await import(monoSetupPath).then(m => m.default)

        if (!id) {
            cli.info('Remolding the monorepo itself...', 'green.bold').indent()
            cli.item("Set up root .env's", 'gray.bold').indent()

            await constructAndWriteEnvFiles(
                CWD,
                setup.env.schema,
                setup.env.values,
                setup.env.valuesProduction
            )

            // entries

            cli.reset()
            cli.info('Remolding all entries...', 'green.bold').indent()

            let exitCode = 0

            cli.reset()

            // TODO: Consider parallelizing?
            for (const entry of setup._entries) {
                const code = await remold(entry.id, opts)

                if (code !== 0) {
                    exitCode = code
                    break
                }
            }

            cli.log('').success('Remolded all entries successfully!', 'green.bold').reset()

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

        if (!(await dirExists(folder))) {
            cli.item(`Create non-existent folder ${absoluteToRelative(folder)}`, 'gray.bold')
            await Bun.$`mkdir -p ${folder}`.quiet()
        }

        if (entry._actions.length > 0) {
            cli.item('Run addon actions', 'gray.bold').indent()
        }

        for (const action of entry._actions) {
            if (opts.verbose) {
                cli.item(`${action.name}`, 'gray.italic').indent()
            }

            await action.callback(entry, {
                verbose: opts.verbose
            })

            if (opts.verbose) cli.dedent()
        }

        cli.reset()

        return 0
    } catch (e: unknown) {
        cli.handleError(e)
        return 1
    }
}
