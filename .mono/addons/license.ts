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

export function $license(license: MonoLicense): MonoAddon {
    return {
        order: 0,
        callback: (entry: _MonoEntryInternal) => {}
    }
}
