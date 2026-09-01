/**
 * Breaks text into lines based on a specified width.
 *
 * @param text The text to break into lines.
 * @param lineWidth The maximum width of each line.
 * @returns An array of strings, each representing a line of text.
 */
export function breakTextToLines(text: string, lineWidth: number = 79): string[] {
    const result: string[] = []
    let line = ''

    const words = text.split(' ')

    for (const word of words) {
        if (word === '') {
            continue
        }

        if ((line + word).length > lineWidth) {
            // result += `${line.trimEnd()}\n`
            result.push(line.trimEnd())
            line = ''
        }

        line += `${word} `
    }

    if (line.length > 0) {
        result.push(line.trimEnd())
    }

    return result
}
