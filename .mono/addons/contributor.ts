import type { _MonoEntryInternal, MonoAddon, MonoFormattedPersonText, MonoPerson } from '../mono'
import { parseFormattedPersonText } from '../bin/mono'

export function $contributor(contributor: MonoPerson | MonoFormattedPersonText): MonoAddon {
    const details =
        typeof contributor === 'string' ? parseFormattedPersonText(contributor) : contributor

    async function addContributorToMeta(entry: _MonoEntryInternal) {
        entry._meta.contributors ??= []
        entry._meta.contributors.push(details)
    }

    return {
        name: $contributor.name,
        unique: false,
        setup: [
            {
                order: 0,
                callback: addContributorToMeta
            }
        ]
    }
}
