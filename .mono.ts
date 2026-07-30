import { $author, $git, $license, $npm, $static, setup } from './.mono/mono'

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

    apps: [],
    modules: [
        {
            id: 'huid-spec',
            public: true,
            name: "Howion's Unique IDentifier",
            description: "RFC-like specification of Howion's Unique IDentifier (HUID)",
            addons: [
                $authorHowion,
                $git('howionlabs', 'huid-spec'),
                $license('cc-by-sa-30'),
                $static('.markdownlint.jsonc')
            ]
        },
        {
            id: 'huid-ts',
            public: true,
            name: "Howion's Unique IDentifier",
            description:
                "The official reference implementation in TypeScript for Howion's Unique IDentifier.",
            addons: [
                $authorHowion,
                $git('howionlabs', 'huid-ts'),
                $license('mit'),
                $npm('@howionlabs/huid', {}),
                $static('.editorconfig'),
                $static('.gitignore'),
                $static('.markdownlint.jsonc'),
                $static('biome.jsonc')
            ]
        }
    ]
})
