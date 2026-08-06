import type { MonoSetupInternal } from 'mono'
import { availableParallelism } from 'node:os'
import { type SimpleGit, type SimpleGitOptions, simpleGit } from 'simple-git'
import { monoSetupPath } from './constants'
import { cli } from './utils/cli'
import { dirExists } from './utils/fs'

export function simpleGitFactory(baseDir: string): SimpleGit {
    const simpleGitOptions: Partial<SimpleGitOptions> = {
        baseDir,
        binary: 'git',
        maxConcurrentProcesses: availableParallelism(),
        trimmed: true // trim the output of all git commands
    }

    return simpleGit(simpleGitOptions)
}

export interface PullOptions {
    /**
     * @default false
     */
    verbose?: boolean
}

export async function pull(id?: string, options?: PullOptions): Promise<number> {
    try {
        const opts = {
            verbose: false,
            ...options
        }

        const setup: MonoSetupInternal = await import(monoSetupPath).then(m => m.default)

        if (!id) {
            cli.info('Pulling all tracked entries...', 'green.bold').indent()

            let exitCode = 0

            for (const entry of setup._entriesMap.values()) {
                if (entry._meta.git === undefined) {
                    cli.item(
                        `Skipping "${entry._type}s/${entry.id}" because it is not git tracked.`,
                        'gray'
                    )
                }

                const code = await pull(entry.id, opts)

                if (code !== 0) {
                    exitCode = code
                    break
                }
            }

            cli.reset()

            return exitCode
        }

        const entry = setup._entriesMap.get(id)

        if (!entry) {
            cli.error(`Entry with the identifier "${id}" could not be found.`)
            cli.reset()
            return 1
        }

        // make sure the entry path exists
        const baseDir = entry._path
        const gitFolder = `${baseDir}/.git`
        const linkablePath = `${entry._type}s/${entry.id}`

        if (!(await dirExists(baseDir))) {
            throw new Error(
                `Tracked entry "${linkablePath}" folder does not exist. Please run "bun mono remold" first.`
            )
        }

        if (!(await dirExists(gitFolder))) {
            throw new Error(
                `Tracked entry "${linkablePath}" is not a git repository. Please run "bun mono remold" first.`
            )
        }

        const git = simpleGitFactory(baseDir)

        const gitBranch = entry._meta.git!.branch
        const currentBranch = (await git.branchLocal()).current

        if (currentBranch !== gitBranch) {
            throw new Error(
                `Tracked entry "${linkablePath}" is on branch "${currentBranch}", but the expected branch is "${gitBranch}". Please switch to the correct branch and try again.`
            )
        }

        await git.fetch().pull('origin', gitBranch)

        cli.indent().item(linkablePath, 'white.bold').indent()

        cli.reset()

        return 0
    } catch (e: unknown) {
        cli.handleError(e)
        return 1
    }
}
