import type { MonoSetupInternal } from 'mono'
import { availableParallelism } from 'node:os'
import { type SimpleGit, type SimpleGitOptions, simpleGit } from 'simple-git'
import { ROOT_GIT_BRANCH_NAME } from './constants'
import { readMonoSetup } from './mono'
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

export async function pull(
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
            cli.info('Pulling all tracked entries...', 'green.bold').indent()

            for (const entry of setup._entriesMap.values()) {
                if (entry._meta.git === undefined) {
                    cli.item(
                        `Skipping "${entry._zone}/${entry.id}" because it is not git tracked.`,
                        'gray'
                    )
                    continue
                }

                const code = await pull(entry.id, opts, setup)

                if (code !== 0) {
                    cli.reset()
                    return code
                }
            }

            return 0
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
        const identifierZoned = `${entry._zone}/${entry.id}`

        if (!(await dirExists(baseDir))) {
            throw new Error(
                `Tracked entry "${identifierZoned}" folder does not exist. Please run "bun mono remold" first.`
            )
        }

        if (!(await dirExists(gitFolder))) {
            throw new Error(
                `Tracked entry "${identifierZoned}" is not a git repository. Please run "bun mono remold" first.`
            )
        }

        const git = simpleGitFactory(baseDir)

        const monoBranch = ROOT_GIT_BRANCH_NAME
        const currentBranch = (await git.branchLocal()).current

        if (currentBranch !== monoBranch) {
            throw new Error(
                `Tracked entry "${identifierZoned}" is on branch "${currentBranch}", but the mono branch is "${monoBranch}". Please switch to the correct branch and try again.`
            )
        }

        await git.fetch().pull()

        cli.item(identifierZoned, 'white')

        return 0
    } catch (e: unknown) {
        cli.handleError(e)
        return 1
    }
}
