import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { constructAndWriteEnvFiles } from '../bin/env'
import { _monoEnvSetup } from '../bin/mono'

export function $env(...variables: string[]): MonoAddon {
    async function addEnvVariablesToMeta(entry: _MonoEntryInternal) {
        if (entry._type !== 'app') {
            throw new Error(
                `Failed to add $env to "${entry.id}": $env addon can only be used on apps, not on ${entry._type}s.`
            )
        }

        entry._meta.env ??= { variables: new Set() }

        for (const variable of variables) {
            entry._meta.env.variables.add(variable)
        }
    }

    async function writeEnvFiles(entry: _MonoEntryInternal) {
        const envSetup = await _monoEnvSetup()

        await constructAndWriteEnvFiles(
            entry._path,
            envSetup.schema,
            envSetup.values,
            envSetup.valuesProduction
        )

        // .env
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
                callback: writeEnvFiles
            }
        ]
    }
}
