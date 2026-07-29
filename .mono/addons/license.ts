import { cli } from '../bin/utils/cli'
import type { _MonoEntryInternal, MonoAddon, MonoLicense } from '../mono'

// import path from 'node:path'
// import { licenseDirs, licensesDirPath } from '../paths'
// import { cli } from '../utils'

// export const monoLicenseMap: Record<string, MonoLicense> = {}

// for (const licenseDir of licenseDirs) {
//     const folderName = path.basename(licenseDir)
//     const folderPath = path.join(licensesDirPath, licenseDir)
//     const licensePath = path.join(folderPath, 'LICENSE')

//     if (!(await Bun.file(licensePath).exists())) {
//         cli.warn(`License file not found for "${folderName}" in "${licensePath}". Skipping.`)
//         continue
//     }

//     const details = JSON.parse(await Bun.file(path.join(folderPath, 'details.json')).text())

//     monoLicenseMap[folderName] = {
//         path: licensePath,
//         name: details.name,
//         npm: details.npm || undefined
//     }
// }

export const LICENSES = [
    'agpl-v3',
    'cc-by-sa-30',
    'howion-closed-source',
    'mit',
    'mpl-2.0'
] as const

export function $license(license: MonoLicense): MonoAddon {
    function callback(entry: _MonoEntryInternal) {
        if (typeof license !== 'string' || !LICENSES.includes(license)) {
            throw new Error(`Invalid license type: ${license}`)
        }

        if (entry.public === false && license !== 'howion-closed-source') {
            cli.warn(
                `Entry "${entry.name}" is marked as private, but the license "${license}" is not a closed-source license. Consider using "howion-closed-source" for private entries.`
            )
        }

        entry._meta.license = license
    }

    return {
        order: 0,
        callback
    }
}
