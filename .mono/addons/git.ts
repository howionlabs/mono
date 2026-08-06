import type { _MonoEntryInternal, MonoAddon, MonoGit } from '../mono'
import { MONO_AUTOGEN_DISCLAIMER, monoAddonGitignoreFile } from '../bin/constants'
import { rootGitBranchName } from '../bin/git'
import { cli } from '../bin/utils/cli'
import { resolveEntryPath, writeFile } from '../bin/utils/fs'

let constructedGitignore = ''

async function constructGitignoreContent(): Promise<string> {
    if (constructedGitignore) return constructedGitignore

    let content = MONO_AUTOGEN_DISCLAIMER
    content += '\n\n'

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

/**
 * Sets the Git version control system information for a project entry. This
 * function allows you to specify the owner, repository name, and protocol
 * (either SSH or HTTPS) for the Git configuration. The Git information is
 * stored in the `_meta` property of the entry to be possibly later used in
 * other actions or Git-related mono operations. For example, $pjson action
 * will use this information to set the repository field in the package.json
 * file.
 *
 * @param owner The owner of the repository, typically a username or
 * organization name.
 * @param repo The name of the repository.
 * @param protocol The protocol to use for accessing the repository, either
 * 'ssh' or 'https'. Defaults to 'ssh'.
 * @param server The Git server to use, such as 'github.com'.
 */
export function $git(
    owner: string,
    repo: string,
    protocol: 'ssh' | 'https' = 'ssh',
    branch?: string,
    server: MonoGit['server'] = 'github.com'
): MonoAddon {
    async function addGitDataToMeta(entry: _MonoEntryInternal) {
        if (entry._meta.git) {
            cli.warn(
                `Git information already exists for the entry ${entry.id}. Overwriting existing Git information.`
            )
        }

        entry._meta.git = {
            server,
            protocol,
            owner,
            repo,
            branch: branch ?? (await rootGitBranchName())
        }
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
            }
        ]
    }
}
