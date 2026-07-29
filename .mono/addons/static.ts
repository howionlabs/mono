import type { _MonoEntryInternal, MonoAddon } from '../mono'

/**
 * Resolves a static file from `.mono/static` and copies it to the target project.
 *
 * @param from File path relative to `.mono/static` directory. Ex: `.gitignore`
 * @param to Optional file path relative to the target project. If not provided, the file will be
 * copied to the same path as `from` relative to the target project.
 */
export function $static(from: string, to?: string): MonoAddon {
    return {
        order: 0,
        callback: (entry: _MonoEntryInternal) => {}
    }
}
