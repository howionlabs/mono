// import type { _MonoEntryInternal, MonoAddon } from '../mono.ts'
// import { resolveEntryPath } from '../bin/utils/fs.ts'

// export function $go(name: string): MonoAddon {
//     async function populateMetaGo(entry: _MonoEntryInternal) {
//         if (entry._meta.go) {
//             throw new Error(
//                 `Failed to populate entry Go metadata for "${entry._zone}/${entry.id}" because the entry's metadata already contains npm data.`
//             )
//         }
//     }

//     async function structureEntryFolder(entry: _MonoEntryInternal) {
//         const folder = resolveEntryPath(entry)

//         await Bun.$`mkdir -p ${folder}/internal`
//         await Bun.$`mkdir -p ${folder}/cmd`
//         await Bun.$`mkdir -p ${folder}/pkg`
//         await Bun.$`mkdir -p ${folder}/vendor`
//     }

//     return {
//         name: $go.name,
//         unique: true,
//         setup: [
//             {
//                 callback: populateMetaGo,
//                 order: -40
//             }
//         ]
//         // remold: []
//     }
// }
