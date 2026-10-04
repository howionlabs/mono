import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { rootCodeOfConductFile, rootContributingFile, rootSecurityFile } from '../bin/constants'
import { copyFile, resolveEntryPath } from '../bin/utils/fs'

export enum Policy {
    CodeOfConduct = 2 ** 0,
    Contributor = 2 ** 1,
    Security = 2 ** 2,
    All = CodeOfConduct | Contributor | Security
}

export function $policy(policies: number): MonoAddon {
    async function writePolicyFiles(entry: _MonoEntryInternal) {
        if (policies & Policy.CodeOfConduct) {
            await copyFile(rootCodeOfConductFile, resolveEntryPath(entry, 'CODE_OF_CONDUCT.md'), true)
        }

        if (policies & Policy.Contributor) {
            await copyFile(rootContributingFile, resolveEntryPath(entry, 'CONTRIBUTING.md'), true)
        }

        if (policies & Policy.Security) {
            await copyFile(rootSecurityFile, resolveEntryPath(entry, 'SECURITY.md'), true)
        }
    }

    return {
        name: $policy.name,
        unique: false,
        remold: [
            {
                order: 10,
                callback: writePolicyFiles
            }
        ]
    }
}
