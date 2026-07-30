import type { WriteStream } from 'node:tty'
import { styleText, type InspectColor } from 'node:util'

export type CLIModifier = InspectColor | `${InspectColor}.${InspectColor}`

export const INDENT_WIDTH = 7

/**
 * This is basically a wrapper around console.log, console.warn, and
 * console.error with node styleText.
 */
export const cli = {
    _indentation: 0,

    indent(n: number = INDENT_WIDTH) {
        this._indentation += n

        return this
    },

    dedent(n: number = INDENT_WIDTH) {
        this._indentation -= n

        if (this._indentation < 0) {
            this._indentation = 0
        }

        return this
    },

    setIndentation(n: number) {
        this._indentation = n

        if (this._indentation < 0) {
            this._indentation = 0
        }

        return this
    },

    warn(m?: unknown) {
        this.__writeIndentation()
        return this.write(`[WARN] `, 'yellow')
            .indent(7)
            .write(m, 'bold.white')
            .dedent(7)
            .write('\n')
    },

    error(m?: unknown) {
        this.__writeIndentation()
        return this.write(`[FAIL] `, 'red').indent(7).write(m, 'bold.white').dedent(7).write('\n')
    },

    info(m?: unknown) {
        this.__writeIndentation()
        return this.write(`[INFO] `, 'blue').indent(7).write(m, 'bold.white').dedent(7).write('\n')
    },

    success(m?: unknown) {
        this.__writeIndentation()
        return this.write(`[ OK ] `, 'green').indent(7).write(m, 'bold.white').dedent(7).write('\n')
    },

    log(m?: unknown, modifier: CLIModifier = 'gray') {
        this.__writeIndentation()
        return this.write(m, modifier).write('\n')
    },

    item(m?: unknown, modifier: CLIModifier = 'gray') {
        this.__writeIndentation()
        return this.write(`- `, modifier).indent(2).write(m, modifier).dedent(2).write('\n')
    },

    write(m?: unknown, modifier: CLIModifier = 'gray') {
        this.__write(this.__normalize(m, modifier))
        return this
    },

    __writeIndentation() {
        if (this._indentation > 0) {
            const m = ' '.repeat(this._indentation)
            this.__write(m)
        }
    },

    __normalize(m: unknown, modifier?: CLIModifier) {
        if (m === '') {
            return ''
        }

        if (typeof m !== 'string') {
            if (m === undefined) {
                m = '<undefined>'
                modifier = 'italic.gray'
            } else if (m === null) {
                m = '<null>'
                modifier = 'italic.gray'
            } else if (typeof m === 'object') {
                m = JSON.stringify(m, null, 2)
                modifier = 'italic.gray'
            } else if (typeof m === 'function') {
                m = `<function> ${m}`
                modifier = 'italic.gray'
            } else {
                m = `<unknown> ${m}`
                modifier = 'italic.gray'
            }
        }

        const lines = (m as string).split('\n')

        if (lines.length > 1) {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i] === '') continue
                lines[i] = ' '.repeat(this._indentation) + lines[i]
            }

            m = lines.join('\n')
        }

        const modifiers: InspectColor[] = []

        if (modifier !== undefined) {
            if (modifier.includes('.')) {
                const [first, second] = modifier.split('.') as [InspectColor, InspectColor]
                modifiers.push(first, second)
            } else {
                modifiers.push(modifier as InspectColor)
            }
        }

        return styleText(modifiers, m as string)
    },

    __write(buffer: string | Uint8Array, stream: WriteStream = process.stdout) {
        stream.write(buffer)
    }
}
