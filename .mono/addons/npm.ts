import type { _MonoEntryInternal, MonoAddon } from '../mono.ts'
import { cli } from '../bin/utils/cli.ts'
import { readJSONFile, resolveEntryPath, resolveRootPath, writeFile } from '../bin/utils/fs.ts'

export type DependencyRecord = Record<string, string | 'root'>

export interface BuildPJSONOptions {
    mustDependencies?: DependencyRecord
    mustDevDependencies?: DependencyRecord
    mustPeerDependencies?: DependencyRecord
    mustScripts?: Record<string, string>
}

let rootPjson = {} as Record<string, any> | null

async function normalizeDependencies(deps: DependencyRecord) {
    if (!rootPjson) {
        rootPjson = await readJSONFile(resolveRootPath('package.json'))
    }

    if (!rootPjson) {
        throw new Error(
            'Failed to read the root package.json file. Please ensure that the file exists and is accessible.'
        )
    }

    for (const [dep, version] of Object.entries(deps)) {
        if (version === 'root') {
            const rootVersion = rootPjson.dependencies?.[dep] || rootPjson.devDependencies?.[dep]

            if (!rootVersion) {
                throw new Error(
                    `Failed to resolve dependency version for "${dep}" because it was not found in the root package.json.`
                )
            }

            deps[dep] = rootVersion
        }
    }

    return deps
}

export function $npm(name: string, options?: BuildPJSONOptions): MonoAddon {
    async function constructAndAddPjsonDataToMeta(entry: _MonoEntryInternal) {
        const pjsonPath = resolveEntryPath(entry, 'package.json')
        const previous = await readJSONFile(pjsonPath)
        const next: any = {}

        if (previous) {
            Object.assign(next, previous)
        }

        next.name = name

        if (next.version && next.version !== entry.version) {
            cli.info(
                `Updating the NPM version of "${entry.id}" from "${next.version}" to "${entry.version}" based on the entry's current metadata.`
            )

            next.version = entry.version
        }

        next.description = entry.description
        next.private = !entry.public
        next.homepage = entry.website

        if (entry.keywords && entry.keywords.length > 0) {
            next.keywords = entry.keywords
        } else {
            delete next.keywords
        }

        if (entry._meta.author) {
            next.author = entry._meta.author
        } else {
            if (next.author) {
                cli.warn(
                    `Removing previous author data from "${entry.id}" because no author was found in the entry's current metadata.`
                )
            } else {
                cli.warn(
                    `No author information found for "${entry.id}". Please consider adding an author to the entry's current metadata.`
                )
            }

            delete next.author
        }

        if (entry._meta.contributors && entry._meta.contributors.length > 0) {
            next.contributors = entry._meta.contributors.map(contributor => ({
                email: contributor.email,
                name: contributor.name,
                url: contributor.url
            }))
        } else {
            if (next.contributors && next.contributors.length > 0) {
                cli.warn(
                    `Removing previous contributors data from "${entry.id}" because no contributors were found in the entry's current metadata.`
                )
            }

            delete next.contributors
        }

        if (entry._meta.license?.npm) {
            next.license = entry._meta.license.npm
        } else {
            if (next.license) {
                cli.warn(
                    `Removing previous license data from "${entry.id}" because no license was found in the entry's current metadata.`
                )
            } else {
                cli.warn(
                    `No license information found for "${entry.id}". Please consider adding a license to the entry's current metadata.`
                )
            }

            delete next.license
        }

        if (entry.public && entry._meta.git) {
            next.repository = {
                type: 'git',
                url: `git+https://${entry._meta.git.server}/${entry._meta.git.owner}/${entry._meta.git.repo}.git`
            }

            if (entry._meta.git.server === 'github.com' && entry._meta.author) {
                const url = `https://github.com/${entry._meta.git.owner}/${entry._meta.git.repo}/issues`

                next.bugs = {
                    email: entry._meta.author.email,
                    url
                }
            }
        } else {
            delete next.repository
        }

        next.dependencies = {
            ...next.dependencies,
            ...(await normalizeDependencies(options?.mustDependencies ?? {}))
        }

        next.devDependencies = {
            ...next.devDependencies,
            ...(await normalizeDependencies(options?.mustDevDependencies ?? {}))
        }

        next.peerDependencies = {
            ...next.peerDependencies,
            ...(await normalizeDependencies(options?.mustPeerDependencies ?? {}))
        }

        if (options?.mustScripts) {
            next.scripts = {
                ...next.scripts,
                ...options.mustScripts
            }
        }

        entry._meta.npm = {
            latestPJSON: next
        }
    }

    async function writePjson(entry: _MonoEntryInternal) {
        const pjson = entry._meta.npm?.latestPJSON

        if (!pjson) {
            throw new Error(
                `Failed to write package.json for "${entry.id}" because the latest package.json data is missing from the entry's metadata.`
            )
        }

        const pjsonPath = resolveEntryPath(entry, 'package.json')
        const nextText = `${JSON.stringify(pjson, null, 4)}\n`

        await writeFile(nextText, pjsonPath, true)
    }

    return {
        actions: [
            {
                callback: constructAndAddPjsonDataToMeta,
                name: '$npm.constructAndAddPJSONDataToMeta',
                order: 20
            },
            {
                callback: writePjson,
                name: '$npm.writePJSON',
                order: 30
            }
        ],
        name: '$npm',
        unique: true
    }
}
