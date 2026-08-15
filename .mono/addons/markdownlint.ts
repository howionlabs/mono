import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { monoMDLintConf, monoPJSON } from '../bin/constants'
import { resolveEntryPath, writeFile } from '../bin/utils/fs'

async function writeMDLintFile(entry: _MonoEntryInternal) {
    const newMDLintConf = structuredClone(monoMDLintConf)
    const newMDLintContents = JSON.stringify(newMDLintConf, null, 4)

    const newMDLintFile = Bun.file(resolveEntryPath(entry, '.markdownlint.jsonc'))
    await writeFile(newMDLintContents, newMDLintFile, true)
}

async function addMDLintToPJSON(entry: _MonoEntryInternal) {
    if (!entry._meta.npm?.nextPJSON) return

    delete entry._meta.npm.nextPJSON.dependencies.markdownlint
    entry._meta.npm.nextPJSON.devDependencies.markdownlint = monoPJSON.dependencies.markdownlint
}

export function $markdownlint(): MonoAddon {
    return {
        name: $markdownlint.name,
        unique: true,
        setup: [
            {
                order: 1,
                callback: addMDLintToPJSON
            }
        ],
        remold: [
            {
                order: 0,
                callback: writeMDLintFile
            }
        ]
    }
}
