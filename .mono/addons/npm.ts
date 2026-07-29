import type { _MonoEntryInternal, MonoAddon } from '../mono'

export interface BuildPJSONOptions {
    dependencies?: Record<string, string | 'root'>
    devDependencies?: Record<string, string | 'root'>
}

/**
 * Builds the `package.json` file for the mono project.
 */
export function $npm(options: BuildPJSONOptions): MonoAddon {
    return {
        order: 0,
        callback: (entry: _MonoEntryInternal) => {
            const pjson = {}
        }
    }
}
