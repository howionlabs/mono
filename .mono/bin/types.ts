export type AuthorMap = Map<string, MonoAuthor>
export type EntryMap = Map<string, _MonoEntryInternal>

export type MonoLicense = 'agpl-v3' | 'cc-by-sa-30' | 'howion-closed-source' | 'mit' | 'mpl-2.0'

export interface MonoVCS {
    server: 'github.com'
    protocol: 'ssh' | 'https'
    owner: string
    repo: string
}

export interface MonoAuthor {
    /**
     * Unique identifier for the author, used for referencing in other parts of the configuration
     */
    id: string

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
    url?: string
}

// export interface MonoFile<T extends Record<string, string> = Record<string, string>> {
//     type: 'static' | 'dynamic'

//     /**
//      * Relative path to the static file within .mono/static folder.
//      * @example ".gitignore"
//      */
//     from: string

//     /**
//      * Relative path to the destination of the mono entry. If not specified, it
//      * is assumed to be the root of the mono entry.
//      * @example "public/favicon.ico" or "."
//      * @default "."
//      */
//     to?: string

//     /**
//      * For dynamic files, this is a record of variable names to their
//      * respective values. For static files, this property is not used.
//      */
//     values?: T
// }

export interface MonoAddon {
    /**
     * The order in which the addon should be executed relative to other
     * addons. Lower numbers are executed first.
     */
    order: number

    callback: (entry: _MonoEntryInternal) => void
}

export interface MonoEntryOptionals {
    /**
     * id(s) of the author(s) of the project. Could be an empty array or not
     * defined.
     */
    authors: string | string[]

    copyright: string

    website: `https://${string}`

    public: boolean

    /**
     * The version of the project, following semantic versioning (semver) conventions.
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

    authors?: string[]

    addons?: MonoAddon[]
}

export type _MonoEntryType = 'app' | 'module'

export interface _MonoEntryInternal extends Required<MonoEntry> {
    type: _MonoEntryType
    path: string

    _authors: MonoAuthor[]

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
        vcs?: MonoVCS
    }
}

export interface MonoSetup {
    /**
     * Non-empty list of authors that can be referenced in the configuration.
     * Each author must have a unique ID, and the configuration will throw an
     * error if duplicate IDs are found. Authors can be referenced in entries
     * (apps and modules) by their ID.
     */
    authors: [MonoAuthor, ...MonoAuthor[]]

    apps?: Partial<MonoEntry>[]
    modules?: Partial<MonoEntry>[]

    /**
     * Addons that are applied to all entries: both apps and modules. These
     * addons will be executed **BEFORE** the entry-specific addons.
     */
    commonAddons?: MonoAddon[]

    defaults: MonoEntryOptionals
}

export interface MonoSetupInternal extends Required<MonoSetup> {
    apps: _MonoEntryInternal[]
    modules: _MonoEntryInternal[]

    _authorMap: AuthorMap
    _entryMap: EntryMap
}
