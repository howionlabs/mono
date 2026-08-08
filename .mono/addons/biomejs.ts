import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { monoBiomeConf } from '../bin/constants'
import { resolveEntryPath, writeFile } from '../bin/utils/fs'

async function writeBiomeFile(entry: _MonoEntryInternal) {
    const newBiomeConf = structuredClone(monoBiomeConf)
    newBiomeConf.root = false

    const newBiomeContents = JSON.stringify(newBiomeConf, null, 4)
    const newBiomeFile = Bun.file(resolveEntryPath(entry, 'biome.jsonc'))

    await writeFile(newBiomeContents, newBiomeFile, true)
}

async function syncPJSONDependencies(entry: _MonoEntryInternal) {
    if (!entry._meta.npm?.nextPJSON) return

    delete entry._meta.npm.nextPJSON.dependencies['@biomejs/biome']
    entry._meta.npm.nextPJSON.devDependencies['@biomejs/biome'] = monoBiomeConf
}

export function $biomejs(): MonoAddon {
    return {
        name: '$biomejs',
        unique: true,
        setup: [
            {
                name: '$biomejs.syncPJSONDependencies',
                order: 1,
                callback: syncPJSONDependencies
            }
        ],
        remold: [
            {
                name: '$biomejs.writeBiomeFile',
                order: 0,
                callback: writeBiomeFile
            }
        ]
    }
}
