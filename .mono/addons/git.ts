import type { _MonoEntryInternal, MonoAddon, MonoGit } from '../mono'
import { cli } from '../bin/utils/cli'

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
            repo
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
            }
        ]
    }
}
