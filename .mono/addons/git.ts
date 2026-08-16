import type { _MonoEntryInternal, MonoAddon, MonoGitURI } from '../mono'
import {
    MONO_AUTOGEN_DISCLAIMER,
    MONO_HASHTAG_BAR,
    monoAddonGitignoreFile,
    ROOT_GIT_BRANCH_NAME
} from '../bin/constants'
import { buildRemoteUrl, parseGitURI, simpleGitFactory } from '../bin/git'
import { cli } from '../bin/utils/cli'
import { dirExists, resolveEntryPath, writeFile } from '../bin/utils/fs'

let constructedGitignore = ''

async function constructGitignoreContent(): Promise<string> {
    if (constructedGitignore) return constructedGitignore

    let content = `${MONO_HASHTAG_BAR}\n`
    content += MONO_AUTOGEN_DISCLAIMER
    content += `\n${MONO_HASHTAG_BAR}\n\n`

    content += await monoAddonGitignoreFile.text()

    constructedGitignore = content

    return content
}

export interface GitAddonOptions {
    /**
     * @default true
     */
    gitignore?: boolean
}

export function $git($uri: MonoGitURI, opts?: GitAddonOptions): MonoAddon {
    const useGitignore = opts?.gitignore ?? true

    const monoGit = parseGitURI($uri)

    async function addGitDataToMeta(entry: _MonoEntryInternal) {
        if (entry._meta.git) {
            cli.warn(
                `Git information already exists for the entry ${entry.id}. Overwriting existing Git information.`
            )
        }

        entry._meta.git = monoGit
    }

    async function writeGitignoreFile(entry: _MonoEntryInternal) {
        if (useGitignore === false) return

        if (!entry._meta.git) {
            throw new Error(
                `Cannot write .gitignore file for the entry "${entry._zone}/${entry.id}" because Git information is missing. Please ensure that the $git addon has been properly applied to this entry before attempting to write the .gitignore file.`
            )
        }

        const newGitignoreContent = await constructGitignoreContent()
        const newGitignoreFile = Bun.file(resolveEntryPath(entry, '.gitignore'))

        await writeFile(newGitignoreContent, newGitignoreFile, true)
    }

    async function initializeGit(
        entry: _MonoEntryInternal /*, { verbose }: MonoAddonActionOptions */
    ) {
        if (!entry._meta.git) {
            throw new Error(
                `Cannot initialize Git for the entry "${entry._zone}/${entry.id}" because Git information is missing. Please ensure that the $git addon has been properly applied to this entry before attempting to initialize Git.`
            )
        }

        // if (opts.verbose) { }

        // note: git.checkIsRepo() returns true since the parent directory that
        // is our mono(repo) is a git repository

        if (await dirExists(resolveEntryPath(entry, '.git'))) {
            // note that this git instance is for the entry's directory, not
            // the mono root directory
            // todo: check this better
            const git = simpleGitFactory(entry._path)

            // make sure the repo is correctly initialized with the correct
            // remote and branch
            const remote = await git.getRemotes(true)
            const remoteOrigin = remote.find(r => r.name === 'origin')

            if (!remoteOrigin) {
                throw new Error(
                    `Git repository for entry "${entry._zone}/${entry.id}" is missing the "origin" remote. Please either uninitialize the repository or add the correct "origin" remote manually.`
                )
            }

            const { fetch, push } = remoteOrigin.refs

            const correctRemoteUrl = buildRemoteUrl(entry._meta.git)

            if (fetch !== correctRemoteUrl || push !== correctRemoteUrl) {
                throw new Error(
                    `Git repository for entry "${entry._zone}/${entry.id}" has an "origin" remote that does not match the expected URL. Expected: fetch=push=${correctRemoteUrl}, Found: fetch=${fetch}, push=${push}. Please either uninitialize the repository or update the "origin" remote manually.`
                )
                // await git.removeRemote('origin').addRemote('origin', correctRemoteUrl).fetch()
            }

            // make sure the branch is correct
            const monoBranch = ROOT_GIT_BRANCH_NAME
            const currentBranch = (await git.branch(['--show-current'])).current

            if (currentBranch !== monoBranch) {
                throw new Error(
                    `Git repository for entry "${entry._zone}/${entry.id}" is on branch "${currentBranch}", but the expected branch is "${monoBranch}". Please either uninitialize the repository or switch to the correct branch manually.`
                )
            }

            // make sure the repo is up to date with the remote
            await git.fetch()
        } else {
            const git = simpleGitFactory(entry._path)

            await git
                .init()
                .addRemote('origin', buildRemoteUrl(entry._meta.git))
                .fetch()
                .branch(['-M', ROOT_GIT_BRANCH_NAME])
                .checkout(['-f', ROOT_GIT_BRANCH_NAME])
        }
    }

    return {
        name: $git.name,
        unique: true,
        setup: [
            {
                order: 0,
                callback: addGitDataToMeta
            }
        ],
        remold: [
            {
                order: 10,
                callback: writeGitignoreFile
            },
            {
                order: 20,
                callback: initializeGit
            }
        ]
    }
}
