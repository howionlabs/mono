import type { _MonoEntryInternal, MonoAddon, MonoAddonActionOptions, MonoGitURI } from '../mono'
import { MONO_AUTOGEN_DISCLAIMER, MONO_HASHTAG_BAR, monoAddonGitignoreFile } from '../bin/constants'
import { initializeGitRepo, parseGitURI, rootGitBranchName } from '../bin/git'
import { cli } from '../bin/utils/cli'
import { resolveEntryPath, writeFile } from '../bin/utils/fs'

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

async function writeGitignoreFile(entry: _MonoEntryInternal) {
    if (!entry._meta.git) {
        throw new Error(
            `Cannot write .gitignore file for the entry "${entry.id}" because Git information is missing. Please ensure that the $git addon has been properly applied to this entry before attempting to write the .gitignore file.`
        )
    }

    const newGitignoreContent = await constructGitignoreContent()
    const newGitignoreFile = Bun.file(resolveEntryPath(entry, '.gitignore'))

    await writeFile(newGitignoreContent, newGitignoreFile, true)
}

export function $git($uri: MonoGitURI): MonoAddon {
    const monoGit = parseGitURI($uri)

    async function addGitDataToMeta(entry: _MonoEntryInternal) {
        if (entry._meta.git) {
            cli.warn(
                `Git information already exists for the entry ${entry.id}. Overwriting existing Git information.`
            )
        }

        entry._meta.git = monoGit
    }

    async function initializeGit(entry: _MonoEntryInternal, opts: MonoAddonActionOptions) {
        if (!entry._meta.git) {
            throw new Error(
                `Cannot initialize Git for the entry "${entry.id}" because Git information is missing. Please ensure that the $git addon has been properly applied to this entry before attempting to initialize Git.`
            )
        }

        // if (opts.verbose) {
        // }

        await initializeGitRepo(resolveEntryPath(entry), entry._meta.git)
    }

    return {
        name: '$git',
        unique: true,
        actions: [
            {
                name: '$git.addGitDataToMeta',
                order: 0,
                callback: addGitDataToMeta
            },
            {
                name: '$git.writeGitignoreFile',
                order: 10,
                callback: writeGitignoreFile
            },
            {
                name: '$git.initializeGit',
                order: 20,
                callback: initializeGit
            }
        ]
    }
}
