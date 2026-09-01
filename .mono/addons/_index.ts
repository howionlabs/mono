export * from './author'
export * from './biomejs'
export * from './bun'
export * from './contributor'
export * from './env'
export * from './git'
// export * from './github'
// export * from './keys'
export * from './license'
export * from './markdownlint'
export * from './npm'
export * from './static'
export * from './vercel'
export * from './vscode'

/**
 * A single addon can have multiple actions, and they will be executed in the
 * order of their `order` property. The `order` property is a number that
 * indicates the order in which the action should be executed among all actions
 * of all addons. The lower the number, the earlier the action will be
 * executed.
 *
 * This way, for example, $npm addon can read the metadata of the entry about
 * $author, $git, and $license etc, and then modify the content of the entry
 * accordingly.
 *
 * Moreover, this ordering also makes it fail-safe so that no matter what order
 * the addons are registered, the actions will always be executed in the
 * correct order.
 *
 * Up to 100...
 */

/**
 * 0 $author.addAuthorToMeta
 * 0 $contributor.addAuthorToMeta
 * 0 $env.addEnvVariablesToMeta
 * 0 $license.addLicenseDataToMeta
 * 0 $git.addGitDataToMeta
 *
 * 10 $static.writeStaticFile
 * 10 $env.writeEnvFiles
 * 10 $license.copyLicense
 *
 * 20 $npm.constructAndAddPJSONDataToMeta
 *
 * 30 $npm.writePJSON
 *
 * 40 $keys
 *
 */
