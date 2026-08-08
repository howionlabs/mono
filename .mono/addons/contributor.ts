import type { _MonoEntryInternal, MonoAddon, MonoPerson } from '../mono'
import { parseFormattedPersonText } from '../bin/mono'

export function $contributor(contributor: MonoPerson | string): MonoAddon {
    const details =
        typeof contributor === 'string' ? parseFormattedPersonText(contributor) : contributor

    async function addContributorToMeta(entry: _MonoEntryInternal) {
        entry._meta.contributors ??= []
        entry._meta.contributors.push(details)
    }

    return {
        name: '$contributor',
        unique: false,
        setup: [
            {
                name: '$contributor.addContributorToMeta',
                order: 0,
                callback: addContributorToMeta
            }
        ]
    }
}
