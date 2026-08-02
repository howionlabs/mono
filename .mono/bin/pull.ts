import { availableParallelism } from 'node:os'
import { type SimpleGit, type SimpleGitOptions, simpleGit } from 'simple-git'

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
    return 0
}
