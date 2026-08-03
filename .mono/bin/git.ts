import type { MonoGit } from 'mono'
import { availableParallelism } from 'node:os'
import { type SimpleGit, type SimpleGitOptions, simpleGit } from 'simple-git'
import { CWD } from './utils/fs'

export async function rootGitBranchName(): Promise<string> {
    const git = simpleGit(CWD)
    return (await git.branch()).current
}

export function simpleGitFactory(baseDir: string): SimpleGit {
    const simpleGitOptions: Partial<SimpleGitOptions> = {
        baseDir,
        binary: 'git',
        maxConcurrentProcesses: availableParallelism(),
        trimmed: true // trim the output of all git commands
    }

    return simpleGit(simpleGitOptions)
}

export function buildRemoteUrl(opts: MonoGit): string {
    if (opts.protocol === 'ssh') {
        return `git@${opts.server}:${opts.owner}/${opts.repo}.git`
    } else if (opts.protocol === 'https') {
        return `https://${opts.server}/${opts.owner}/${opts.repo}.git`
    } else {
        throw new Error(`Unsupported Git protocol "${opts.protocol}"`)
    }
}

export async function initGitRepo(baseDir: string, opts: MonoGit): Promise<SimpleGit> {
    const git = simpleGitFactory(baseDir)

    const branch = opts.branch || 'main'

    await git.init().addRemote('origin', buildRemoteUrl(opts)).branch(['-M', branch]).fetch()

    return git
}
