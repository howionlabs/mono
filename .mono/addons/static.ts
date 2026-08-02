import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { copyFile, resolveEntryPath, resolveRootPath } from '../bin/utils/fs'

/**
 * Resolves a static file from `.mono/static` and copies it to the target
 * project. Does not overwrite existing file if the target file contents are
 * the same (xxhash64) as the source file.
 *
 * @param from File path relative to `.mono/static` directory. Ex: `.gitignore`
 * @param to Optional file path relative to the target project. If not
 * provided, the file will be copied to the same path as `from` relative to the
 * target project.
 */
export function $static(from: string, to?: string, alwaysOverwrite: boolean = false): MonoAddon {
    if (!to) to = from

    if (to.startsWith('.env')) {
        throw new Error(`$static does not support copying files to .env* paths. Use $env instead.`)
    }

    async function writeStaticFile(entry: _MonoEntryInternal) {
        const fromAbsolute = resolveRootPath(`static/${from}`)
        const toAbsolute = resolveEntryPath(entry, to ?? from)

        await copyFile(fromAbsolute, toAbsolute, !alwaysOverwrite)
    }

    return {
        name: '$static',
        unique: false,
        actions: [
            {
                name: '$static.writeStaticFile',
                order: 10,
                callback: writeStaticFile
            }
        ]
    }
}

/**
 * Shorthand for `$static` that allows specifying multiple files to be copied
 * to the target project.
 */
export function $statics(...files: string[]): MonoAddon[] {
    return files.map(file => $static(file))
}
