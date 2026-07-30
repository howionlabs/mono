import type { LICENSES } from '../mono'

export type EntryMap = Map<string, _MonoEntryInternal>

export type MonoLicenseId = (typeof LICENSES)[number]

export interface MonoLicense {
    id: MonoLicenseId
    name: string
    npm?: string
}

export interface MonoGit {
    server: 'github.com'
    protocol: 'ssh' | 'https'
    owner: string
    repo: string
}

export interface MonoPerson {
    /**
     * Human-readable name of the author
     */
    name: string

    /**
     * Email address of the author, used for contact and attribution purposes
     */
    email: string

    /**
     * URL to the author's personal or professional website, providing
     * additional context and information about the author
     */
    url: string
}

export type MonoAddon = Array<{
    /**
     * The order in which the addon action should be executed relative to all
     * the other addons' actions. Lower numbers are executed first.
     */
    order: number
    callback: (entry: _MonoEntryInternal) => void | Promise<void>
}>

export interface MonoEntryOptionals {
    copyright: string

    website: `https://${string}`

    public: boolean

    /**
     * The version of the project, following semantic versioning (semver)
     * conventions.
     */
    version: string
}

export interface MonoEntry extends Partial<MonoEntryOptionals> {
    /**
     * Unique identifier for the project, used for referencing in other parts
     * of the configuration. Preferably the folder name of the project in ascii
     * lowercase with hyphens.
     */
    id: string

    /**
     * Human-readable project name
     */
    name: string

    /**
     * Human-readable project description
     */
    description: string

    /**
     * List of keywords describing the project, used for search and discovery
     */
    keywords?: string[]

    addons?: MonoAddon[]
}

export type _MonoEntryType = 'app' | 'module'

export interface _MonoEntryInternal extends Required<MonoEntry> {
    type: _MonoEntryType
    path: string

    /**
     * Internal metadata for the mono setup, used for storing additional
     * information that may be needed during processing or execution. This can
     * include configuration details, state information, or any other relevant
     * data.
     *
     * Possibly will be edited and consumed among different addons.
     */
    _meta: {
        license?: MonoLicense
        git?: MonoGit
        author?: MonoPerson
        contributors?: MonoPerson[]
        env?: {
            variables: Set<string>
        }
        // [key: string]: unknown
    }
}

export interface MonoSetup {
    apps?: Partial<MonoEntry>[]
    modules?: Partial<MonoEntry>[]

    defaults: MonoEntryOptionals
}

export interface MonoSetupInternal extends Required<MonoSetup> {
    apps: _MonoEntryInternal[]
    modules: _MonoEntryInternal[]

    _entryMap: EntryMap
}
