import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { parse } from 'dotenv'
import { resolveRootPath } from '../bin/utils/fs'

const rootEnvPath = resolveRootPath('.env')
const rootEnvExamplePath = resolveRootPath('.env.example')
const rootEnvProductionPath = resolveRootPath('.env.production')

let rootEnv: Record<string, string> | null = null
let rootEnvExample: Record<string, string> | null = null
let rootEnvProduction: Record<string, string> | null = null
let envFilesRead = false

export function $env(...variables: string[]): MonoAddon {
    async function addEnvVariablesToMeta(entry: _MonoEntryInternal) {
        entry._meta.env ??= { variables: new Set() }

        for (const variable of variables) {
            entry._meta.env.variables.add(variable)
        }
    }

    async function writeEnvFiles() {
        // idempotent operation to read the env files only once
        await readEnvFiles()
    }

    return {
        name: '$env',
        unique: false,
        actions: [
            {
                name: 'addEnvVariablesToMeta',
                order: 0,
                callback: addEnvVariablesToMeta
            },
            {
                name: 'writeEnvFiles',
                order: 1,
                callback: writeEnvFiles
            }
        ]
    }
}

async function readEnvFile(path: string): Promise<Record<string, string> | null> {
    const file = Bun.file(path)

    if (await file.exists()) {
        const contents = await file.text()
        return parse(contents)
    } else {
        return null
    }
}

async function readEnvFiles(): Promise<void> {
    if (envFilesRead) {
        return
    }

    envFilesRead = true

    const [env, envExample, envProduction] = await Promise.all([
        readEnvFile(rootEnvPath),
        readEnvFile(rootEnvExamplePath),
        readEnvFile(rootEnvProductionPath)
    ])

    rootEnv = env
    rootEnvExample = envExample
    rootEnvProduction = envProduction
}
