import type { LICENSES } from './constants'

export type MonoLicenseId = (typeof LICENSES)[number]

export interface MonoLicense {
    readonly id: MonoLicenseId
    readonly name: string
    readonly npm?: string
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
    readonly server: MonoGitServer
    readonly protocol: MonoGitProtocol
    readonly owner: MonoGitOwner
    readonly repo: MonoGitRepo

    readonly user?: MonoGitSSHUser
    readonly port?: MonoGitPort
}

export interface MonoPerson {
    /**
     * Human-readable name of the author
     */
    readonly name: string

    /**
     * Email address of the author, used for contact and attribution purposes
     */
    readonly email?: string

    /**
     * URL to the author's personal or professional website, providing
     * additional context and information about the author
     */
    readonly url?: string
}

export interface MonoAddonActionOptions {
    readonly verbose?: boolean
}

export type MonoAddonActionCallback = (entry: _MonoEntryInternal) => void | Promise<void>

export interface MonoAddonAction {
    /**
     * Name of the addon action for debugging and logging purposes. It should
     * be unique across all addons to avoid confusion. However, this does not
     * imply that the addon action cannot be used multiple times.
     */
    readonly name: string

    /**
     * The order in which the addon action should be executed relative to all
     * the other addons' actions. Lower numbers are executed first.
     */
    readonly order: number

    /**
     * The callback function that will be executed when the addon action is
     * run.
     */
    readonly callback: MonoAddonActionCallback
}

export interface MonoAddon {
    /**
     * Name of the addon for debugging and logging purposes. It should be
     * unique across all addons to avoid confusion. However, this does not
     * imply that the addon cannot be used multiple times.
     */
    readonly name: string

    /**
     * Whether the addon could be used multiple times in the same entry. If set
     * to true, subsequent uses of the addon will result in fatal error.
     *
     * @default true
     */
    readonly unique?: boolean

    /**
     * Non-empty lsit of actions which will always be executed on every mono
     * setup is loaded.
     */
    readonly setup?: readonly [MonoAddonAction, ...MonoAddonAction[]]

    /**
     * Non-empty list of actions which will be executed when the remold command
     * is run.
     */
    readonly remold?: readonly [MonoAddonAction, ...MonoAddonAction[]]

    // /**
    //  * Non-empty list of actions which will be executed when the pull command
    //  * is run.
    //  */
    // pull?: [MonoAddonAction, ...MonoAddonAction[]]

    // /**
    //  * Non-empty list of actions which will be executed when the push command
    //  * is run.
    //  */
    // push?: [MonoAddonAction, ...MonoAddonAction[]]
}

export interface MonoEntry {
    /**
     * Unique identifier for the project, used for referencing in other parts
     * of the configuration.
     * - Must be unique among all entries in all zones.
     * - Should match the folder name of the project and
     * must be in lowercase ascii with hyphens without leading or trailing
     * whitespace.
     * - Must not contain any special characters or spaces.
     */
    readonly id: string

    /**
     * Human-readable project description
     */
    readonly description?: string

    /**
     * Human-readable project name
     */
    readonly name: string

    /**
     * Whether the project is public or private.
     *
     * @default false
     */
    readonly public?: boolean

    /**
     * Version of the project, following semantic versioning.
     */
    readonly version: string

    /**
     * URL to the project's website or homepage, providing additional context
     * and information about the project.
     */
    readonly website?: string

    /**
     * List of keywords describing the project, used for search and discovery
     */
    readonly keywords?: string[]

    readonly addons?: readonly MonoAddon[]
}

export interface PJSON extends Record<string, unknown> {
    name: string
    version: string
    description?: string

    dependencies: Record<string, string>
    devDependencies: Record<string, string>
    peerDependencies: Record<string, string>
}

export interface _MonoEntryInternal extends MonoEntry {
    _zone: string

    /**
     * Absolute path to the project folder.
     */
    _path: string

    /**
     * Order-ascending list of actions provided by addons. Could have multiple
     * (non-unique) actions with the same name.
     */
    readonly _remoldActions: readonly MonoAddonAction[]
    // readonly _pullActions: readonly MonoAddonAction[]
    // readonly _pushActions: readonly MonoAddonAction[]

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
    readonly _name: string

    /**
     * Optional description of the environment variable.
     *
     * @default undefined
     */
    readonly _description?: string

    /**
     * Whether the environment variable is required or optional.
     *
     * @default true
     */
    readonly _required: boolean

    /**
     * The type of the environment variable, which can be either 'text',
     * 'number', or 'boolean'.
     *
     * @default 'text'
     */
    readonly _type: 'text' | 'number' | 'boolean'

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
    readonly _default?: string | number | boolean
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
    readonly zones: Record<string, readonly MonoEntry[]>
    readonly workspaces?: Record<string, readonly string[]>
}

export interface MonoSetupInternal extends Required<MonoSetup> {
    readonly env: _MonoEnvInternal
    readonly zones: Record<string, readonly _MonoEntryInternal[]>

    readonly _workspacesMap: Map<string, readonly _MonoEntryInternal[]>
    readonly _entriesMap: Map<string, _MonoEntryInternal>
}

export interface _MonoEnvInternal {
    readonly schema: MonoEnvMap
    readonly values: MonoEnvValueMap | undefined
    readonly valuesProduction: MonoEnvValueMap | undefined
}
