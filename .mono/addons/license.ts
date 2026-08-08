import type { _MonoEntryInternal, MonoAddon, MonoLicense, MonoLicenseId } from '../mono'
import { LICENSES } from '../bin/constants'
import { cli } from '../bin/utils/cli'
import { copyFile, readJSONFile, resolveDotMonoPath, resolveEntryPath } from '../bin/utils/fs'

export function $license(id: MonoLicenseId): MonoAddon {
    async function addLicenseDataToMeta(entry: _MonoEntryInternal) {
        if (typeof id !== 'string' || !LICENSES.includes(id as MonoLicenseId)) {
            throw new Error(`Invalid license type: ${id}`)
        }

        const licenseDetail = await readJSONFile<Omit<MonoLicense, 'id'>>(
            resolveDotMonoPath(`licenses/${id}/details.json`)
        )

        if (!licenseDetail) {
            throw new Error(`License details for "${id}" are missing or invalid.`)
        }

        if (!licenseDetail.name || typeof licenseDetail.name !== 'string') {
            throw new Error(`License "${id}" does not have a valid name in its details.`)
        }

        if (!licenseDetail.npm || typeof licenseDetail.npm !== 'string') {
            if (entry.public) {
                throw new Error(
                    `License "${id}" does not have a valid npm field in its details. For public projects, this field is required.`
                )
            } else {
                cli.warn(
                    `License "${id}" does not have a valid npm field in its details. This may cause issues when publishing to npm.`
                )
            }
        }

        entry._meta.license = {
            id,
            ...licenseDetail
        }
    }

    async function copyLicense(entry: _MonoEntryInternal) {
        const licensePath = resolveDotMonoPath(`licenses/${entry._meta.license!.id}/LICENSE`)
        await copyFile(licensePath, resolveEntryPath(entry, 'LICENSE'), true)
    }

    return {
        name: '$license',
        unique: true,
        setup: [
            {
                name: '$license.addLicenseDataToMeta',
                order: -1,
                callback: addLicenseDataToMeta
            }
        ],
        remold: [
            {
                name: '$license.copyLicense',
                order: 10,
                callback: copyLicense
            }
        ]
    }
}
