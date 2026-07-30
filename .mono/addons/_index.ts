export * from './author'
export * from './env'
export * from './git'
export * from './license'
export * from './npm'
export * from './static'

/**
 * About the order of the addon actions, we have this general rule of thumb:
 *
 * 0-63: Actions that modify the metadata of the entry
 * 64-127: Actions that modify the content of the entry
 *
 * A single addon can have multiple actions, and they will be executed in the
 * order of their `order` property. The `order` property is a number that
 * indicates the order in which the action should be executed among all the
 * actions of all the addons. The lower the number, the earlier the action will
 * be executed.
 *
 * This way, for example, $npm addon can read the metadata of the entry about
 * $author, $git, and $license etc, and then modify the content of the entry
 * accordingly.
 *
 * Moreover, this ordering also makes it fail-safe so that no matter what order
 * the addons are registered, the actions will always be executed in the
 * correct order.
 */
