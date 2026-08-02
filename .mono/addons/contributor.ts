import type { _MonoEntryInternal, MonoAddon, MonoPerson } from '../mono'

export function $contributor(details: MonoPerson): MonoAddon {
    async function addContributorToMeta(entry: _MonoEntryInternal) {
        entry._meta.contributors ??= []
        entry._meta.contributors.push(details)
    }

    return {
        name: '$contributor',
        unique: false,
        actions: [
            {
                name: '$contributor.addContributorToMeta',
                order: 0,
                callback: addContributorToMeta
            }
        ]
    }
}
