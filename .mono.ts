import { setup } from './.mono/mono'

export default setup({
    authors: [
        {
            id: 'howion',
            name: 'howion',
            email: 'me@howion.com',
            url: 'https://howion.com'
        }
    ],

    defaults: {
        authors: ['howion'],
        copyright: 'Copyright (c) 2026 Howion Inc.',
        website: 'https://www.howion.com',
        public: false,
        version: '0.0.1'
    },

    // commonAddons: [$static('.editorconfig'), $static('.gitignore'), $static('.markdownlint.jsonc')],

    apps: [],
    modules: []
})
