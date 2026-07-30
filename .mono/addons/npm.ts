import type { _MonoEntryInternal, MonoAddon } from '../mono'
import { readJSONFile, resolveEntryPath, resolveRootPath, writeFile } from '../bin/utils/fs'
import { cli } from '../bin/utils/cli'

export type DependencyRecord = Record<string, string | 'root'>

export interface BuildPJSONOptions {
    mustDependencies?: DependencyRecord
    mustDevDependencies?: DependencyRecord
    mustPeerDependencies?: DependencyRecord
    mustScripts?: Record<string, string>
}

let rootPJSON = {} as Record<string, any> | null

async function normalizeDependencies(deps: DependencyRecord) {
    if (!rootPJSON) {
        rootPJSON = await readJSONFile(resolveRootPath('package.json'))
    }

    if (!rootPJSON) {
        throw new Error(
            'Failed to read the root package.json file. Please ensure that the file exists and is accessible.'
        )
    }

    for (const [dep, version] of Object.entries(deps)) {
        if (version === 'root') {
            const rootVersion = rootPJSON.dependencies?.[dep] || rootPJSON.devDependencies?.[dep]

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
    async function buildAndWritePackageJSON(entry: _MonoEntryInternal) {
        const pjsonPath = resolveEntryPath(entry, 'package.json')
        const previous = await readJSONFile(pjsonPath)
        const next: any = {}

        if (previous) {
            Object.assign(next, previous)
        }

        next.name = name
        next.version = entry.version
        next.description = entry.description
        next.private = !entry.public
        next.homepage = entry.website

        if (entry.keywords.length > 0) {
            next.keywords = entry.keywords
        } else {
            delete next.keywords
        }

        if (entry._meta.author) {
            const author = entry._meta.author

            next.author.email = author.email
            next.author.name = author.name
            next.author.url = author.url
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
            next.contributors = entry._meta.contributors.map(contributor => {
                return {
                    email: contributor.email,
                    name: contributor.name,
                    url: contributor.url
                }
            })
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
                    url,
                    email: entry._meta.author.email
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

        const nextText = `${JSON.stringify(next, null, 4)}\n`

        await writeFile(nextText, pjsonPath, true)
    }

    return [
        {
            order: 0,
            callback: buildAndWritePackageJSON
        }
    ]
}
