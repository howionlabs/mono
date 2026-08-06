import type { MonoGit, MonoGitURI } from 'mono'
import { availableParallelism } from 'node:os'
import { type SimpleGit, type SimpleGitOptions, simpleGit } from 'simple-git'
import {
    MONO_GIT_URI_HTTPS_REGEX,
    MONO_GIT_URI_SCP_REGEX,
    MONO_GIT_URI_SSH_REGEX
} from './constants'
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

export async function initializeGitRepo(baseDir: string, opts: MonoGit): Promise<SimpleGit> {
    const git = simpleGitFactory(baseDir)

    const branch = await rootGitBranchName()

    await git.init().addRemote('origin', buildRemoteUrl(opts)).branch(['-M', branch]).fetch()

    return git
}

export function parseGitURI(uri: MonoGitURI): MonoGit {
    if (uri.startsWith('https://')) {
        const match = uri.match(MONO_GIT_URI_HTTPS_REGEX)

        if (!match?.groups) {
            throw new Error(`Invalid HTTPS Git URI: ${uri}`)
        }

        const { user, server, port, owner, repo } = match.groups

        return {
            protocol: 'https',
            server: server!,
            owner: owner!,
            repo: repo!,
            user,
            port: port ? Number.parseInt(port, 10) : undefined
        }
    }

    if (uri.startsWith('ssh://')) {
        const match = uri.match(MONO_GIT_URI_SSH_REGEX)

        if (!match?.groups) {
            throw new Error(`Invalid SSH Git URI: ${uri}`)
        }

        const { user, server, port, owner, repo } = match.groups

        return {
            protocol: 'ssh',
            server: server!,
            owner: owner!,
            repo: repo!,
            user: user!,
            port: port ? Number.parseInt(port, 10) : undefined
        }
    }

    // fallback to scp-like syntax
    const match = uri.match(MONO_GIT_URI_SCP_REGEX)

    if (match?.groups) {
        const { user, server, port, owner, repo } = match.groups

        return {
            protocol: 'ssh',
            server: server!,
            owner: owner!,
            repo: repo!,
            user: user!,
            port: port ? Number.parseInt(port, 10) : undefined
        }
    }

    throw new Error(`Unsupported Git URI format: ${uri}`)
}
