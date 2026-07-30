import { $author, setup } from './.mono/mono'

const $authorHowion = $author({
    name: 'howion',
    email: 'me@howion.com',
    url: 'https://howion.com'
})

export default setup({
    defaults: {
        copyright: 'Copyright (c) 2026 Howion Inc.',
        website: 'https://www.howion.com',
        public: false,
        version: '0.0.1'
    },

    // commonAddons: [$static('.editorconfig'), $static('.gitignore'), $static('.markdownlint.jsonc')],

    apps: [],
    modules: []
})
