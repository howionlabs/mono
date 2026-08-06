import type { LICENSES } from './constants'

export type MonoLicenseId = (typeof LICENSES)[number]

export interface MonoLicense {
    id: MonoLicenseId
    name: string
    npm?: string
}

export type MonoGitProtocol = 'ssh' | 'https'
export type MonoGitServer = string
export type MonoGitOwner = string
export type MonoGitRepo = string

export type MonoGitSSHUser = string
export type MonoGitPort = number

export type MonoGitURI = string
// // https syntax
// | `https://${MonoGitServer}/${MonoGitOwner}/${MonoGitRepo}.git`
// | `https://${MonoGitServer}:${MonoGitPort}/${MonoGitOwner}/${MonoGitRepo}.git`
// // scp syntax
// | `${MonoGitSSHUser}@${MonoGitServer}:${MonoGitOwner}/${MonoGitRepo}.git`
// | `${MonoGitSSHUser}@${MonoGitServer}:${MonoGitPort}/${MonoGitOwner}/${MonoGitRepo}.git`
// // standard SSH syntax
// | `ssh://${MonoGitSSHUser}@${MonoGitServer}/${MonoGitOwner}/${MonoGitRepo}.git`
// | `ssh://${MonoGitSSHUser}@${MonoGitServer}:${MonoGitPort}/${MonoGitOwner}/${MonoGitRepo}.git`

export interface MonoGit {
    server: MonoGitServer
    protocol: MonoGitProtocol
    owner: MonoGitOwner
    repo: MonoGitRepo

    user?: MonoGitSSHUser
    port?: MonoGitPort
}

export interface MonoPerson {
    /**
     * Human-readable name of the author
     */
    name: string

    /**
     * Email address of the author, used for contact and attribution purposes
     */
    email?: string

    /**
     * URL to the author's personal or professional website, providing
     * additional context and information about the author
     */
    url?: string
}

export interface MonoAddonActionOptions {
    verbose?: boolean
}

export interface MonoAddonAction {
    /**
     * Name of the addon action for debugging and logging purposes. It should
     * be unique across all addons to avoid confusion. However, this does not
     * imply that the addon action cannot be used multiple times.
     */
    name: string

    /**
     * The order in which the addon action should be executed relative to all
     * the other addons' actions. Lower numbers are executed first.
     */
    order: number

    callback: (entry: _MonoEntryInternal, opts: MonoAddonActionOptions) => void | Promise<void>
}

export interface MonoAddon {
    /**
     * Name of the addon for debugging and logging purposes. It should be
     * unique across all addons to avoid confusion. However, this does not
     * imply that the addon cannot be used multiple times.
     */
    name: string

    /**
     * Whether the addon could be used multiple times in the same entry. If set
     * to true, subsequent uses of the addon will result in fatal error.
     *
     * @default true
     */
    unique?: boolean

    /**
     * Non-empty list of actions provided by the addon. Could have multiple
     * actions with the same name which will be executed in their respective
     * order.
     */
    actions: [MonoAddonAction, ...MonoAddonAction[]]
}

export interface MonoEntry {
    /**
     * Unique identifier for the project, used for referencing in other parts
     * of the configuration.
     * - Must be unique both in apps and modules.
     * - Should match the folder name of the project and
     * must be in lowercase ascii with hyphens without leading or trailing
     * whitespace.
     * - Must not contain any special characters or spaces.
     */
    id: string

    /**
     * Human-readable project description
     */
    description?: string

    /**
     * Human-readable project name
     */
    name: string

    /**
     * Whether the project is public or private.
     *
     * @default false
     */
    public?: boolean

    /**
     * Version of the project, following semantic versioning.
     */
    version: string

    /**
     * URL to the project's website or homepage, providing additional context
     * and information about the project.
     */
    website?: string

    /**
     * List of keywords describing the project, used for search and discovery
     */
    keywords?: string[]

    addons?: (MonoAddon | MonoAddon[])[]
}

export type _MonoEntryType = 'app' | 'module'

export interface PJSON extends Record<string, unknown> {
    name: string
    version: string
    description?: string

    dependencies: Record<string, string>
    devDependencies: Record<string, string>
    peerDependencies: Record<string, string>
}

export interface _MonoEntryInternal<T extends _MonoEntryType = _MonoEntryType> extends MonoEntry {
    _type: T

    /**
     * Absolute path to the project folder.
     */
    _path: string

    /**
     * Order-ascending list of actions provided by addons. Could have multiple
     * (non-unique) actions with the same name.
     */
    _actions: MonoAddonAction[]

    /**
     * Internal metadata for the mono setup, used for storing additional
     * information that may be needed during processing or execution. This can
     * include configuration details, state information, or any other relevant
     * data.
     *
     * Possibly will be edited by and consumed among different addons.
     */
    _meta: {
        license?: MonoLicense
        git?: MonoGit
        author?: MonoPerson
        contributors?: MonoPerson[]
        env?: {
            variables: Set<string>
        }
        npm?: {
            nextPJSON: PJSON
        }
        // [key: string]: unknown
    }
}

export interface MonoEnvVariable {
    /**
     * Name of the environment variable, which must be a non-empty string
     * consisting of uppercase ASCII letters, numbers, and underscores only.
     * It must not have leading or trailing whitespace. This is the key used to
     * reference the environment variable in code and configuration.
     */
    _name: string

    /**
     * Optional description of the environment variable.
     *
     * @default undefined
     */
    _description?: string

    /**
     * Whether the environment variable is required or optional.
     *
     * @default true
     */
    _required: boolean

    /**
     * The type of the environment variable, which can be either 'text',
     * 'number', or 'boolean'.
     *
     * @default 'text'
     */
    _type: 'text' | 'number' | 'boolean'

    // /**
    //  * Expected format of the environment variable, represented as a regular
    //  * expression. If provided, the string value of the environment variable
    //  * must match this format.
    //  *
    //  * @default undefined
    //  */
    // format?: RegExp

    /**
     * Optional default value for the environment variable. If provided, this
     * value will be used when the environment variable is not set.
     *
     * @default undefined
     */
    _default?: string | number | boolean
}

export type MonoEnvMap = Map<string, MonoEnvVariable>
export type MonoEnvValueMap = Map<string, string | number | boolean>

// export type MonoSetupWorkspace = {
//     /**
//      * Name of the workspace, which must be a non-empty string consisting of
//      * lowercase ASCII letters, numbers, and hyphens only. It must not have
//      * leading or trailing whitespace. This is the key used to reference the
//      * workspace in code and configuration.
//      */
//     name: string

//     entries: string[]
// }

export interface MonoSetup {
    apps?: MonoEntry[]
    modules?: MonoEntry[]
    // workspaces?: MonoSetupWorkspace[]
}

export interface MonoSetupInternal extends Required<MonoSetup> {
    apps: _MonoEntryInternal[]
    modules: _MonoEntryInternal[]
    env: MonoEnvSetup

    _entriesMap: Map<string, _MonoEntryInternal>
}

export interface MonoEnvSetup {
    schema: MonoEnvMap
    values: MonoEnvValueMap | undefined
    valuesProduction: MonoEnvValueMap | undefined
}
