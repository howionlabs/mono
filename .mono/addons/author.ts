import type { _MonoEntryInternal, MonoAddon, MonoPerson } from '../mono'

export function $author(details: MonoPerson): MonoAddon {
    async function addAuthorToMeta(entry: _MonoEntryInternal) {
        entry._meta.author = details
    }

    return [
        {
            order: 0,
            callback: addAuthorToMeta
        }
    ]
}
