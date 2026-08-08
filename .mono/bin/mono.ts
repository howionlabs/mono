import type {
    _MonoEntryInternal,
    MonoAddonAction,
    MonoEntry,
    MonoPerson,
    MonoSetup,
    MonoSetupInternal
} from './types'
import {
    ENTRY_ID_REGEX,
    FORMATTED_PERSON_TEXT_REGEX,
    monoEnvPath,
    monoSetupPath
} from './constants'
import { readMonoEnv } from './env'
import { cli } from './utils/cli'
import { resolveRootPath } from './utils/fs'

async function internalizeEntries(
    entries: readonly MonoEntry[],
    map: Map<string, _MonoEntryInternal>,
    zone: string
): Promise<_MonoEntryInternal[]> {
    const result: _MonoEntryInternal[] = []

    for (const entry of entries) {
        if (!entry.id || !ENTRY_ID_REGEX.test(entry.id)) {
            throw new Error(`Invalid entry identifier "${entry.id}"`)
        }

        if (map.has(entry.id)) {
            throw new Error(`Duplicate entry identifier "${entry.id}"`)
        }

        const setupActions: MonoAddonAction[] = []
        const remoldActions: MonoAddonAction[] = []

        if (entry.addons) {
            const addonSet = new Set<string>()

            for (const addon of entry.addons) {
                if (addon.unique !== false && addonSet.has(addon.name)) {
                    throw new Error(
                        `Unique addon "${addon.name}" is already registered for the entry "${entry.id}". Unique addons can only be registered once per entry.`
                    )
                }

                addonSet.add(addon.name)

                if (addon.setup) {
                    for (const action of addon.setup) {
                        setupActions.push(action)
                    }
                }

                if (addon.remold) {
                    for (const action of addon.remold) {
                        remoldActions.push(action)
                    }
                }
            }
        }

        // in-place sort, asc
        setupActions.sort((a, b) => a.order - b.order)
        remoldActions.sort((a, b) => a.order - b.order)

        const internal: _MonoEntryInternal = {
            ...entry,
            _zone: zone,
            _path: resolveRootPath(`zones/${zone}/${entry.id}`),
            _remoldActions: remoldActions,
            _meta: {}
        }

        map.set(entry.id, internal)

        for (const action of setupActions) {
            // execute the action
            await action.callback(internal)
        }

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
    // cli.info('Reading the mono setup: .mono.ts, .mono.env.ts', 'bold.green').indent()

    try {
        const map = new Map<string, _MonoEntryInternal>()

        if (!(await Bun.file(monoEnvPath).exists())) {
            throw new Error(
                `Mono environment file ".mono.env.ts" could not be found. Please ensure that the file exists and is accessible.`
            )
        }

        const internalZones: Record<string, _MonoEntryInternal[]> = {}

        for (const [zone, entries] of Object.entries(setup.zones)) {
            internalZones[zone] = await internalizeEntries(entries, map, zone)
        }

        const workspacesMap = new Map<string, _MonoEntryInternal[]>()

        // make sure workspaces are well-formed
        if (setup.workspaces) {
            for (const [wsName, wsEntries] of Object.entries(setup.workspaces)) {
                if (!Array.isArray(wsEntries) || wsEntries.length === 0) {
                    throw new Error(
                        `Workspace "${wsName}" must be an non-empty array of existing entry identifiers.`
                    )
                }

                if (!ENTRY_ID_REGEX.test(wsName)) {
                    throw new Error()
                }

                if (!workspacesMap.has(wsName)) {
                    workspacesMap.set(wsName, [])
                }

                for (const eid of wsEntries) {
                    if (!map.has(eid)) {
                        throw new Error(
                            `Workspace "${wsName}" references an unknown entry identifier "${eid}".`
                        )
                    }

                    const value = workspacesMap.get(wsName)!
                    value.push(map.get(eid)!)
                }
            }
        }

        cli.log('').dedent()

        return {
            zones: internalZones,
            workspaces: setup.workspaces || {},
            env: await readMonoEnv(),

            _entriesMap: map,
            _workspacesMap: workspacesMap
        }
    } catch (e: unknown) {
        cli.handleError(e)
        process.exit(1)
    }
}

export function parseFormattedPersonText(author: string): MonoPerson {
    const match = FORMATTED_PERSON_TEXT_REGEX.exec(author)

    if (!match?.groups) {
        throw new Error(
            `Invalid author string "${author}". Expected format: "name <email> (url)" where email and url are optional.`
        )
    }

    const { name, email, url } = match.groups

    return {
        name: name!.trim(),
        email: email?.trim(),
        url: url?.trim()
    }
}

export async function readMonoSetup(): Promise<MonoSetupInternal> {
    return await mono(await import(monoSetupPath).then(m => m.default))
}
