import type { _MonoEntryInternal, MonoAddon, MonoPerson } from '../mono'

export function $contributor(details: MonoPerson): MonoAddon {
    async function addContributorToMeta(entry: _MonoEntryInternal) {
        if (!entry._meta.contributors) {
            entry._meta.contributors = []
        }

        entry._meta.contributors.push(details)
    }

    return [
        {
            order: 0,
            callback: addContributorToMeta
        }
    ]
}
