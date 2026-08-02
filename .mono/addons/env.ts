import type { _MonoEntryInternal, MonoAddon } from '../mono'

export function $env(...variables: string[]): MonoAddon {
    async function addEnvVariablesToMeta(entry: _MonoEntryInternal) {
        entry._meta.env ??= { variables: new Set() }

        for (const variable of variables) {
            entry._meta.env.variables.add(variable)
        }
    }

    return {
        name: '$env',
        unique: false,
        actions: [
            {
                name: '$env.addEnvVariablesToMeta',
                order: 0,
                callback: addEnvVariablesToMeta
            },
            {
                name: '$env.writeEnvFiles',
                order: 10,
                callback: () => {}
            }
        ]
    }
}
