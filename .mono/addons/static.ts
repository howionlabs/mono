import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { staticFilesList } from '../bin/constants'
import { copyFile, pathGlobToRegex, resolveEntryPath, resolveRootPath } from '../bin/utils/fs'

/**
 * Resolves a static file from `.mono/static` and copies it to the target
 * project. Does not overwrite existing file if the target file contents are
 * the same (xxhash64) as the source file.
 *
 */
export function $static(fromGlob: string, toGlob: string, alwaysOverwrite = false): MonoAddon {
    const map = new Map<string, string>()
    const toSet = new Set<string>()

    const fromRegex = pathGlobToRegex(fromGlob)

    for (const from of staticFilesList) {
        const match = fromRegex.exec(from)

        if (match) {
            const values = match.slice(1)

            if (values.length === 0) {
                values.push(match[0])
            }

            const to = toGlob.replace(/\*/g, () => values.shift() ?? '')

            if (toSet.has(to)) {
                throw new Error(`Duplicate target path: ${to}`)
            } else {
                toSet.add(to)
            }

            map.set(from, to)
        }
    }

    async function writeStaticFiles(entry: _MonoEntryInternal) {
        for (const [_from, _to] of map.entries()) {
            const fromAbsolute = resolveRootPath(`static/${_from}`)
            const toAbsolute = resolveEntryPath(entry, _to)
            await copyFile(fromAbsolute, toAbsolute, !alwaysOverwrite)
        }
    }

    return {
        name: $static.name,
        unique: false,
        remold: [
            {
                order: 10,
                callback: writeStaticFiles
            }
        ]
    }
}
