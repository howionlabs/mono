import type { _MonoEntryInternal, MonoAddon, MonoPerson } from '../mono'
import { parseFormattedPersonText } from '../bin/mono'
import { cli } from '../bin/utils/cli'

export function $author(author: MonoPerson | string): MonoAddon {
    const details: MonoPerson =
        typeof author === 'string' ? parseFormattedPersonText(author) : author

    async function addAuthorToMeta(entry: _MonoEntryInternal) {
        if (entry._meta.author) {
            cli.warn(
                `Author is already set to "${entry._meta.author.name}" for "${entry.id}". Overwriting with new author "${details.name}".`
            )
        }

        entry._meta.author = details
    }

    return {
        name: '$author',
        unique: true,
        setup: [
            {
                name: '$author.addAuthorToMeta',
                order: 0,
                callback: addAuthorToMeta
            }
        ]
    }
}
