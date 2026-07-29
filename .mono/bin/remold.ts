import fs from 'node:fs'
import { cli } from './utils'
import { monoModuleMap } from './mono'
import { moldMap } from './remold/molds'
import type { MonoModule } from './mono/mono'

export interface RemoldOptions {
    /**
     * @default false
     */
    verbose?: boolean
}

export async function remold(moduleName?: string, options?: RemoldOptions) {
    const opts: Required<RemoldOptions> = {
        verbose: false,
        ...options
    }

    if (!moduleName) {
        cli.warn('Remolding all modules in 3 seconds...')
        await new Promise((resolve) => setTimeout(resolve, 3000))

        for (const name of Object.keys(monoModuleMap)) {
            await remold(name, opts)
        }

        return
    }

    const module = monoModuleMap[moduleName]

    if (!module) {
        cli.error(`Module ${moduleName} not found.`)
        return
    }

    cli.info(`Remolding ${module.id}...`)
    await moldMap[module.mold]!(module, opts.verbose)

    if (module.git) {
        const gitDirExists = hasGitDirSync(module.path)

        if (gitDirExists) {
            cli.item(`Git repository already exists, skipping initialization`)
        } else {
            cli.item(`Initializing git repository...`)
            await initializeGitRepo(module)
        }
    }

    cli.item(`Remolded ${module.id} successfully.`, 'green')
}

function hasGitDirSync(root: string) {
    const folder = fs.readdirSync(root, { withFileTypes: true })
    return folder.some((f) => f.isDirectory() && f.name === '.git')
}

async function initializeGitRepo(module: MonoModule) {
    if (!module.git) {
        cli.error(`Git URL not specified for module ${module.id}. Cannot initialize git repository.`)
        return
    }

    await Bun.$`git init ${module.path} -b main`.quiet()
    await Bun.$`git -C ${module.path} remote add origin ${module.git!}`
}
