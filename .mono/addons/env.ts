import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { isMatch } from 'matcher'
import { constructAndWriteEnvFiles, readMonoEnv } from '../bin/env'

export function $env(...patterns: string[]): MonoAddon {
    async function addEnvVariablesToMeta(entry: _MonoEntryInternal) {
        const monoEnv = await readMonoEnv()

        entry._meta.env ??= { didWrote: false, variables: new Set() }

        const keys = [...monoEnv.schema.keys()]
        const variables = keys.filter(key => isMatch(key, patterns))

        for (const variable of variables) {
            if (!monoEnv.schema.has(variable)) {
                throw new Error(`Env variable "${variable}" is not defined in mono env schema`)
            }

            entry._meta.env.variables.add(variable)
        }
    }

    async function writeEnvFiles(entry: _MonoEntryInternal) {
        const monoEnv = await readMonoEnv()

        if (!entry._meta.env) {
            throw new Error('No env variables found in entry._meta.env')
        }

        if (entry._meta.env.didWrote) {
            return
        }

        const variables = entry._meta.env?.variables

        if (!variables || variables.size === 0) {
            throw new Error('No env variables found in entry._meta.env.variables')
        }

        const filter = ([k]: [string, unknown]) => variables.has(k)

        const newSchema = new Map([...monoEnv.schema].filter(filter))
        const newValues = monoEnv.values ? new Map([...monoEnv.values].filter(filter)) : undefined
        const newValuesProduction = monoEnv.valuesProduction
            ? new Map([...monoEnv.valuesProduction].filter(filter))
            : undefined

        await constructAndWriteEnvFiles(entry._path, newSchema, newValues, newValuesProduction)
    }

    return {
        name: $env.name,
        unique: false,
        setup: [
            {
                order: 0,
                callback: addEnvVariablesToMeta
            }
        ],
        remold: [
            {
                order: 10,
                callback: writeEnvFiles
            }
        ]
    }
}
