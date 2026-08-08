import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { constructAndWriteEnvFiles, readMonoEnv } from '../bin/env'

export function $env(...variables: string[]): MonoAddon {
    async function addEnvVariablesToMeta(entry: _MonoEntryInternal) {
        entry._meta.env ??= { variables: new Set() }

        for (const variable of variables) {
            entry._meta.env.variables.add(variable)
        }
    }

    async function writeEnvFiles(entry: _MonoEntryInternal) {
        const monoEnv = await readMonoEnv()

        await constructAndWriteEnvFiles(
            entry._path,
            monoEnv.schema,
            monoEnv.values,
            monoEnv.valuesProduction
        )
    }

    return {
        name: '$env',
        unique: false,
        setup: [
            {
                name: '$env.addEnvVariablesToMeta',
                order: 0,
                callback: addEnvVariablesToMeta
            }
        ],
        remold: [
            {
                name: '$env.writeEnvFiles',
                order: 10,
                callback: writeEnvFiles
            }
        ]
    }
}
