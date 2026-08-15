import type { _MonoEntryInternal, MonoAddon } from '../mono.ts'
import { cli } from '../bin/utils/cli.ts'
import { readJSONFile, resolveEntryPath, writeFile } from '../bin/utils/fs.ts'

// export type DependencyRecord = Record<
//     string,
//     | 'workspace:*'
//     | `^${number}.${number}.${number}`
//     | `~${number}.${number}.${number}`
//     | `${number}.${number}.${number}`
// >

// export type BuildPJSONOptions = {}

// let rootPjson = {} as Record<string, any> | null

// async function normalizeDependencies() {
//     if (!rootPjson) {
//         rootPjson = await readJSONFile(resolveRootPath('package.json'))
//     }

//     if (!rootPjson) {
//         throw new Error(
//             'Failed to read the root package.json file. Please ensure that the file exists and is accessible.'
//         )
//     }

//     for (const [dep, version] of Object.entries(deps)) {
//         if (version === 'same-as-root') {
//             const rootVersion = rootPjson.dependencies?.[dep] || rootPjson.devDependencies?.[dep]

//             if (!rootVersion) {
//                 throw new Error(
//                     `Failed to resolve dependency version for "${dep}" because it was not found in the root package.json.`
//                 )
//             }

//             deps[dep] = rootVersion
//         }
//     }

//     return deps
// }

export function $npm(name: string): MonoAddon {
    async function populateEntryMeta(entry: _MonoEntryInternal) {
        if (entry._meta.npm) {
            throw new Error(
                `Failed to populate entry metadata for "${entry._zone}/${entry.id}" because the entry's metadata already contains npm data.`
            )
        }

        const pjsonPath = resolveEntryPath(entry, 'package.json')
        const previous = await readJSONFile(pjsonPath)
        const next: any = {}

        if (previous) {
            Object.assign(next, previous)
        }

        entry._meta.npm = {
            nextPJSON: next
        }
    }

    async function constructAndAddPjsonDataToMeta(entry: _MonoEntryInternal) {
        if (!entry._meta.npm) {
            throw new Error(
                `Failed to construct and add package.json data to entry metadata for "${entry._zone}/${entry.id}" because the entry's metadata does not contain npm data.`
            )
        }

        const next = entry._meta.npm.nextPJSON
        next.name = name

        if (next.version && next.version !== entry.version) {
            cli.info(
                `Updating the NPM version of "${entry._zone}/${entry.id}" from "${next.version}" to "${entry.version}" based on the entry's current metadata.`
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
                    `Removing previous author data from "${entry._zone}/${entry.id}" because no author was found in the entry's current metadata.`
                )
            } else {
                cli.warn(
                    `No author information found for "${entry._zone}/${entry.id}". Please consider adding an author to the entry's current metadata.`
                )
            }

            delete next.author
        }

        if (entry._meta.contributors && entry._meta.contributors.length > 0) {
            next.contributors = entry._meta.contributors.map(c => c)
        } else {
            if (next.contributors && next.contributors.length > 0) {
                cli.warn(
                    `Removing previous contributors data from "${entry._zone}/${entry.id}" because no contributors were found in the entry's current metadata.`
                )
            }

            delete next.contributors
        }

        if (entry._meta.license?.npm) {
            next.license = entry._meta.license.npm
        } else {
            if (next.license) {
                cli.warn(
                    `Removing previous license data from "${entry._zone}/${entry.id}" because no license was found in the entry's current metadata.`
                )
            } else {
                cli.warn(`No license information found for "${entry._zone}/${entry.id}".`)
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
            ...next.dependencies
            // ...(await normalizeDependencies(options?.mustDependencies ?? {}))
        }

        next.devDependencies = {
            ...next.devDependencies
            // ...(await normalizeDependencies(options?.mustDevDependencies ?? {}))
        }

        next.peerDependencies = {
            ...next.peerDependencies
            // ...(await normalizeDependencies(options?.mustPeerDependencies ?? {}))
        }

        // if (options?.mustScripts) {
        //     next.scripts = {
        //         ...next.scripts,
        //         ...options.mustScripts
        //     }
        // }

        entry._meta.npm = {
            nextPJSON: next
        }
    }

    async function writePJSON(entry: _MonoEntryInternal) {
        // note that this object could have been modified by other addons
        const pjson = entry._meta.npm?.nextPJSON

        if (!pjson) {
            throw new Error(
                `Failed to write package.json to "${entry._zone}/${entry.id}" because the latest package.json data is missing from the entry's metadata.`
            )
        }

        const pjsonPath = resolveEntryPath(entry, 'package.json')
        const nextText = `${JSON.stringify(pjson, null, 4)}\n`

        await writeFile(nextText, pjsonPath, true)
    }

    return {
        name: $npm.name,
        unique: true,
        setup: [
            {
                callback: populateEntryMeta,
                order: -10
            },
            {
                callback: constructAndAddPjsonDataToMeta,
                order: 20
            }
        ],
        remold: [
            {
                callback: writePJSON,
                order: 30
            }
        ]
    }
}
