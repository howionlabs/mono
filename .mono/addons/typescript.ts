import type { _MonoEntryInternal, MonoAddon } from '../mono'

export function $typescript(id: string): MonoAddon {
    async function addWorkspaceDependencyToPJSON(entry: _MonoEntryInternal) {
        if (!entry._meta.npm) {
            throw new Error(
                `The entry "${entry.id}" does not have the necessary NPM metadata. Please ensure that the $npm addon is applied to this entry before using the $dependency addon.`
            )
        }

        entry._meta.npm.nextPJSON.dependencies[id] = `workspace:*`
    }

    return {
        name: $typescript.name,
        unique: true,
        setup: [
            {
                order: 0,
                callback: addWorkspaceDependencyToPJSON
            }
        ]
    }
}
