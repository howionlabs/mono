import type { MonoSetupInternal } from './types'
import { buildEnv } from './env'
import { rootEnvExampleFile, rootEnvFile, rootEnvProductionFile } from './mono'
import { cli } from './utils/cli'
import { absoluteToRelative, dirExists, resolveRootPath } from './utils/fs'

export const monoSetupPath = resolveRootPath('.mono.ts')

export interface RemoldOptions {
    /**
     * @default false
     */
    verbose?: boolean
}

export async function remold(id?: string, options?: RemoldOptions): Promise<number> {
    const opts: Required<RemoldOptions> = {
        verbose: false,
        ...options
    }

    const setup: MonoSetupInternal = await import(monoSetupPath).then(m => m.default)

    if (!id) {
        cli.info('Remolding the monorepo itself...', 'green.bold').indent()
        cli.item("Set up root .env's", 'white.bold').indent()

        // .env

        cli.item('.env')
        const envContent = buildEnv(setup.env.schema, setup.env.values)
        await rootEnvFile.write(envContent)

        // .env.example

        cli.item('.env.example')
        const envExample = buildEnv(setup.env.schema, undefined)
        await rootEnvExampleFile.write(envExample)

        // .env.production

        cli.item('.env.production')
        const envProduction = buildEnv(setup.env.schema, setup.env.valuesProduction)
        await rootEnvProductionFile.write(envProduction)

        cli.reset()

        // entries

        cli.info('Remolding all the entries...', 'green.bold').indent()

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

        cli.log('').success('Remolded all the entries successfully!', 'green.bold')

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

        await action.callback(entry)

        if (opts.verbose) cli.dedent()
    }

    cli.reset()

    return 0
}

// function hasGitDirSync(root: string) {
//     const folder = fs.readdirSync(root, { withFileTypes: true })
//     return folder.some(f => f.isDirectory() && f.name === '.git')
// }

// async function initializeGitRepo(module: MonoModule) {
//     if (!module.git) {
//         cli.error(
//             `Git URL not specified for module ${module.id}. Cannot initialize git repository.`
//         )
//         return
//     }
//     await Bun.$`git init ${module.path} -b main`.quiet()
//     await Bun.$`git -C ${module.path} remote add origin ${module.git!}`
// }
