import type { _MonoEntryInternal, MonoAddon } from '../mono'

export type BunAddonOptions = {}

export function $bun(id: string): MonoAddon {
    async function updatePJSONForBun(entry: _MonoEntryInternal) {
        // make sure npm meta is set
        if (!entry._meta.npm?.nextPJSON) {
            throw new Error(
                `Could not update package.json for bun because npm addon is not enabled or misconfigured.`
            )
        }
    }

    return {
        name: $bun.name,
        unique: true,
        setup: [
            {
                order: 0,
                callback: updatePJSONForBun
            }
        ]
    }
}
