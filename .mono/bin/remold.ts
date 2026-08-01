import type { MonoSetupInternal } from './types'
import { cli } from './utils/cli'
import { resolveRootPath } from './utils/fs'

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
        // cli.warn('Remolding all the entries...').log('')

        let exitCode = 0

        // TODO: Consider parallelizing?
        for (const entry of setup._entries) {
            const code = await remold(entry.id, opts)

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
        return 1
    }

    cli.info(`Remolding ${entry.id}...`)

    return 0
}

// export async function remold(moduleName?: string, options?: RemoldOptions) {
//     if (module.git) {
//         const gitDirExists = hasGitDirSync(module.path)
//         if (gitDirExists) {
//             cli.item(`Git repository already exists, skipping initialization`)
//         } else {
//             cli.item(`Initializing git repository...`)
//             await initializeGitRepo(module)
//         }
//     }
//     cli.item(`Remolded ${module.id} successfully.`, 'green')
// }

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
