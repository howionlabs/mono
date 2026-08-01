import type {
    _MonoEntryInternal,
    MonoAddonAction,
    MonoEntry,
    MonoEnvMap,
    MonoEnvValueMap,
    MonoSetup,
    MonoSetupInternal
} from './types'
import { readEnv } from './env'
import { resolveRootPath } from './utils/fs'

export const monoEnvPath = resolveRootPath('.mono.env.ts')
export const rootEnvFile = resolveRootPath('.env')

export const ENTRY_ID_REGEX = /^[a-z0-9]+[a-z0-9-]+$/

function internalizeEntries(
    entries: MonoEntry[],
    map: Map<string, _MonoEntryInternal>,
    type: 'app' | 'module'
): _MonoEntryInternal[] {
    const result: _MonoEntryInternal[] = []

    for (const entry of entries) {
        if (!entry.id || !ENTRY_ID_REGEX.test(entry.id)) {
            throw new Error(`Invalid entry ID: ${entry.id}`)
        }

        if (map.has(entry.id)) {
            throw new Error(`Duplicate entry ID: ${entry.id}`)
        }

        const addons = (entry.addons || []).flatMap(addon =>
            Array.isArray(addon) ? addon : [addon]
        )
        const addonSet = new Set<string>()
        const actions: MonoAddonAction[] = []

        for (const addon of addons) {
            if (addon.unique === true && addonSet.has(addon.name)) {
                throw new Error(
                    `Unique addon "${addon.name}" is already registered for the entry "${entry.id}". Unique addons can only be registered once per entry.`
                )
            }

            addonSet.add(addon.name)
            actions.push(...addon.actions)
        }

        // in-place sort, asc
        actions.sort((a, b) => a.order - b.order)

        const internal: _MonoEntryInternal = {
            ...entry,
            _type: type,
            _path: resolveRootPath(`${type}s/${entry.id}`),
            _actions: actions,
            _meta: {}
        }

        map.set(entry.id, internal)
        result.push(internal)
    }

    return result
}

/**
 * Returns a MonoSetupInternal object based on the provided MonoSetup
 * configuration. This function processes authors and entries
 * (apps and modules), ensuring that there are no duplicate IDs and that all
 * referenced authors exist.
 */
export async function mono(setup: MonoSetup): Promise<MonoSetupInternal> {
    const map = new Map<string, _MonoEntryInternal>()

    const envSchema: MonoEnvMap = await import(monoEnvPath).then(module => module.default)
    let envValueMap: MonoEnvValueMap | undefined

    const envFile = Bun.file(rootEnvFile)

    if (await envFile.exists()) {
        const envContent = await envFile.text()
        envValueMap = readEnv(envContent, envSchema)
    }

    const apps = internalizeEntries(setup.apps || [], map, 'app')
    const modules = internalizeEntries(setup.modules || [], map, 'module')

    return {
        apps: apps,
        modules: modules,
        _entries: [...apps, ...modules],
        env: {
            schema: envSchema,
            values: envValueMap
        }
    }
}
