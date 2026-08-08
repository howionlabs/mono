import type { _MonoEntryInternal, MonoAddon } from '../mono'
import {
    MONO_AUTOGEN_DISCLAIMER,
    MONO_HASHTAG_BAR,
    monoAddonEditorConfigFile
} from '../bin/constants'
import { resolveEntryPath, writeFile } from '../bin/utils/fs'

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

export function $vscode(): MonoAddon {
    return {
        name: '$vscode',
        unique: true,
        remold: [
            {
                name: '$vscode.writeDotEditorConfig',
                order: 0,
                callback: writeDotEditorConfig
            }
        ]
    }
}
