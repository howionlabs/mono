import type { _MonoEntryInternal, MonoAddon } from '../mono'

/**
 * Sets the version control system (VCS) information for a project entry. This
 * function allows you to specify the owner, repository name, and protocol
 * (either SSH or HTTPS) for the VCS configuration. The VCS information is
 * stored in the `_meta` property of the entry to be possibly later used in
 * other actions or VCS-related mono operations. For example, $pjson action
 * will use this information to set the repository field in the package.json
 * file.
 *
 * @param owner The owner of the repository, typically a username or
 * organization name.
 * @param repo The name of the repository.
 * @param protocol The protocol to use for accessing the repository, either
 * 'ssh' or 'https'. Defaults to 'ssh'.
 */
export function $vcs(owner: string, repo: string, protocol: 'ssh' | 'https' = 'ssh'): MonoAddon {
    return {
        order: 0,
        callback: (entry: _MonoEntryInternal) => {
            entry._meta.vcs = {
                server: 'github.com',
                protocol,
                owner,
                repo
            }
        }
    }
}
