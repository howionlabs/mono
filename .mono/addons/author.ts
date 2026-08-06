import type { _MonoEntryInternal, MonoAddon, MonoPerson } from '../mono'
import { AUTHOR_REGEX } from '../bin/constants'
import { cli } from '../bin/utils/cli'

function parseAuthorString(author: string): MonoPerson {
    const match = AUTHOR_REGEX.exec(author)

    if (!match?.groups) {
        throw new Error(
            `Invalid author string "${author}". Expected format: "name <email> (url)" where email and url are optional.`
        )
    }

    const { name, email, url } = match.groups

    return {
        name: name!.trim(),
        email: email?.trim(),
        url: url?.trim()
    }
}

export function $author(author: MonoPerson): MonoAddon
export function $author(author: string): MonoAddon
export function $author(author: MonoPerson | string): MonoAddon {
    const details: MonoPerson = typeof author === 'string' ? parseAuthorString(author) : author

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
        actions: [
            {
                name: '$author.addAuthorToMeta',
                order: 0,
                callback: addAuthorToMeta
            }
        ]
    }
}
