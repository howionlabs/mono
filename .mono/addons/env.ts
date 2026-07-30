import type { _MonoEntryInternal, MonoAddon } from '../mono'

export function $env(...variables: string[]): MonoAddon {
    async function updateMeta(entry: _MonoEntryInternal) {
        entry._meta.env ??= { variables: new Set() }

        for (const variable of variables) {
            entry._meta.env.variables.add(variable)
        }
    }

    return [
        {
            order: 0,
            callback: updateMeta
        }
    ]
}
