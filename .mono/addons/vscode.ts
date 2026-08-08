import type { _MonoEntryInternal, MonoAddon } from '../mono'
import {
    MONO_AUTOGEN_DISCLAIMER,
    MONO_HASHTAG_BAR,
    monoAddonEditorConfigFile
} from '../bin/constants'
import { resolveEntryPath, resolveRootPath, writeFile } from '../bin/utils/fs'

let constructedEditorConfig = ''

async function constructEditorConfigContent(): Promise<string> {
    if (constructedEditorConfig) return constructedEditorConfig

    let content = `${MONO_HASHTAG_BAR}\n`
    content += MONO_AUTOGEN_DISCLAIMER
    content += `\n${MONO_HASHTAG_BAR}\n\n`

    content += await monoAddonEditorConfigFile.text()

    constructedEditorConfig = content

    return content
}

async function writeDotEditorConfig(entry: _MonoEntryInternal) {
    const newEditorConfigContent = await constructEditorConfigContent()
    const newEditorConfigFile = Bun.file(resolveEntryPath(entry, '.editorconfig'))

    await writeFile(newEditorConfigContent, newEditorConfigFile, true)
}

async function copyDotVSCodeFolder(entry: _MonoEntryInternal) {
    const rootVSCodeFolder = resolveRootPath('.vscode')
    const entryVSCodeFolder = resolveEntryPath(entry, '.vscode')

    await Bun.$`cp -r ${rootVSCodeFolder} ${entryVSCodeFolder}`
}

export function $vscode(): MonoAddon {
    return {
        name: $vscode.name,
        unique: true,
        remold: [
            {
                order: 0,
                callback: writeDotEditorConfig
            },
            {
                order: 1,
                callback: copyDotVSCodeFolder
            }
        ]
    }
}
