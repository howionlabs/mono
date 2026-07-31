import { mono, $author, $git, $license, $npm, $statics } from './.mono/mono'

const $authorHowion = $author({
    name: 'howion',
    email: 'me@howion.com',
    url: 'https://howion.com'
})

export default mono({
    defaults: {
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
                $statics('.markdownlint.jsonc'),
                $git('howionlabs', 'huid-spec', 'ssh'),
                $license('cc-by-sa-30')
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
                $statics('.editorconfig', '.gitignore', '.markdownlint.jsonc', 'biome.jsonc'),
                $git('howionlabs', 'huid-ts', 'ssh'),
                $license('mit'),
                $npm('@howionlabs/huid', {})
            ]
        }
    ]
})
