import type { WriteStream } from 'node:tty'
import { type InspectColor, styleText } from 'node:util'

export type CLIModifier = InspectColor | `${InspectColor}.${InspectColor}`

export type ItemIcon = 'bullet' | 'check' | 'cross' | 'dash'

export const INDENT_WIDTH = 2

/**
 * This is basically a wrapper around console.log, console.warn, and
 * console.error with node styleText.
 */
export const cli = {
    _indentation: 0,
    noOutput: false,

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

    reset() {
        this._indentation = 0
        return this
    },

    setIndentation(n: number) {
        this._indentation = n

        if (this._indentation < 0) {
            this._indentation = 0
        }

        return this
    },

    warn(m?: unknown, modifier: CLIModifier = 'white') {
        this.__writeIndentation()
        return this.write(`! `, 'yellow.bold').indent(3).write(m, modifier).dedent(3).write('\n')
    },

    error(m?: unknown, modifier: CLIModifier = 'white') {
        this.__writeIndentation()
        return this.write(`✖ `, 'red.bold').indent(3).write(m, modifier).dedent(3).write('\n')
    },

    info(m?: unknown, modifier: CLIModifier = 'white') {
        this.__writeIndentation()
        return this.write(`i `, 'blue.bold').indent(3).write(m, modifier).dedent(3).write('\n')
    },

    success(m?: unknown, modifier: CLIModifier = 'white') {
        this.__writeIndentation()
        return this.write(`✔ `, 'green.bold').indent(3).write(m, modifier).dedent(3).write('\n')
    },

    title(m?: unknown, modifier: CLIModifier = 'white.bold') {
        return this.log(m, modifier)
    },

    log(m?: unknown, modifier: CLIModifier = 'gray') {
        this.__writeIndentation()
        return this.write(m, modifier).write('\n')
    },

    delay(duration: number) {
        return new Promise(resolve => setTimeout(() => resolve(this), duration))
    },

    item(m?: unknown, modifier: CLIModifier = 'gray', icon: ItemIcon = 'bullet') {
        this.__writeIndentation()

        return this.write(`${this.__getIconSymbol(icon)} `, modifier)
            .indent(2)
            .write(m, modifier)
            .dedent(2)
            .write('\n')
    },

    __getIconSymbol(icon: ItemIcon) {
        switch (icon) {
            case 'bullet':
                return '•'
            case 'check':
                return '✔'
            case 'cross':
                return '✖'
            case 'dash':
                return '-'
            default:
                throw new Error(`Unknown icon type: ${icon}`)
        }
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
        if (this.noOutput) {
            return
        }

        stream.write(buffer)
    },

    handleError(e: unknown) {
        const stack =
            new Error().stack
                ?.split('\n')
                .map(l => l.trim())
                .slice(2)
                .join('\n') ?? 'No stack trace available'

        if (e instanceof Error) {
            this.error(e.message, 'red.bold').indent().log(stack, 'gray')
        } else {
            this.error(`Unknown error: ${e}`, 'red.bold')
        }

        this.log('')
    }
}
