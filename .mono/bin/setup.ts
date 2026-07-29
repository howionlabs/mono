import type {
    _MonoEntryInternal,
    _MonoEntryType,
    MonoAuthor,
    MonoEntry,
    MonoSetup,
    MonoSetupInternal
} from './types'

/**
 * Returns a MonoSetupInternal object based on the provided MonoSetup
 * configuration. This function processes authors and entries
 * (apps and modules), ensuring that there are no duplicate IDs and that all
 * referenced authors exist.
 */
export function setup(setup: MonoSetup): MonoSetupInternal {
    const authorMap = new Map<string, MonoAuthor>()

    for (const author of setup.authors) {
        if (authorMap.has(author.id)) {
            throw new Error(`Duplicate author ID: ${author.id}`)
        }

        authorMap.set(author.id, author)
    }

    const entryMap = new Map<string, _MonoEntryInternal>()

    function processEntries(
        type: _MonoEntryType,
        entries: Partial<MonoEntry>[]
    ): _MonoEntryInternal[] {
        const result = []

        for (const entry of entries) {
            if (!entry.id) {
                throw new Error(`Entry is missing required 'id' field`)
            }

            if (entryMap.has(entry.id)) {
                throw new Error(`Duplicate entry ID: ${entry.id}`)
            }

            const author =
                typeof entry.author === 'string' ? authorMap.get(entry.author) : entry.author

            if (!author) {
                throw new Error(`Entry ${entry.id} references unknown author ID: ${entry.author}`)
            }

            const internalEntry: _MonoEntryInternal = {
                ...setup.defaults,
                ...entry,
                author,
                type,
                path: ''
            }

            entryMap.set(internalEntry.id, internalEntry)

            result.push(internalEntry)
        }

        return result
    }

    const apps = processEntries('app', setup.apps || [])
    const modules = processEntries('module', setup.modules || [])

    return {
        authors: setup.authors,
        defaults: setup.defaults,

        apps: apps,
        modules: modules,

        _authorMap: authorMap,
        _entryMap: entryMap
    }
}
