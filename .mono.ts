import { $author, $git, $license, $npm, $statics, mono } from 'mono'

const $authorHowion = $author({
    email: 'me@howion.com',
    name: 'howion',
    url: 'https://howion.com'
})

export default mono({
    apps: [],
    modules: [
        {
            id: 'huid-spec',
            name: "Howion's Unique IDentifier",
            version: '0.1.0',
            public: true,
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
            name: "Howion's Unique IDentifier",
            version: '0.1.0',
            public: true,
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
