import type { MonoAddon, MonoAddonAction } from '../mono'

/**
 * Custom addon action
 */
export function $action(
    name: string,
    order: number,
    callback: MonoAddonAction['callback']
): MonoAddon {
    return {
        name: '$action',
        unique: false,
        actions: [{ name, order, callback }]
    }
}
