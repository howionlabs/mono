# <sup><samp>howionlabs</samp></sup>mono

Howion's custom (hence quite opinionated) monorepo to manage all of its (public and private) [@howionlabs](https://git.howion.com/howionlabs) repositories and/or packages.

## Motivation

None of the existing monorepo tools or structures were good enough and always resulted writing custom scripts. Google's Bazel seemed like a solid choice but the complexity and management of it wasn't worth it. Therefore, hereby we represent our custom monorepo (skeleton) by us for us.

This monorepo is intended to be used with Visual Studio Code, however it is not a necessity, just possible lack of DX features.

## Dependencies

In order to work under this monorepo structure, make sure `bun` and `git` are installed.

Moreover, existence of fundamental unix commands such as `rm`, `cp` and `mkdir` are assumed.

<!-- ## Folder Structure

* **`.mono`** for monorepo-related scripts
    * **`.mono/static`** for static files such as opinionated `.gitignore`'s etc. to be copied/upserted into `apps` and `modules` depending on their configuration.
* (git-ignored) **`apps`** for apps
* (git-ignored) **`modules`** for modules that are possibly seperate projects which could be accessed from `apps` or from other `modules`.
* **`.mono.ts`** is the configuration file to customize the setup.
* **`.editorconfig`**, **`.gitignore`**, **`.markdownlint.jsonc`**, and **`biome.jsonc`** are opinionated configurations whose definitions should match of those in `apps` and `modules`. -->

## Entry Addons

- `$author(author: MonoPerson | MonoFormattedPersonText)`
- `$biomejs()`
- `$bun()`
- `$contributor(contributor: MonoPerson | MonoFormattedPersonText)`
- `$disableTelemetry()` Not implemented yet.
- `$env(...variables: string[])`
- `$git(uri: MonoGitURI)`
- `$go()` Not implemented yet.
- `$keys()` Not implemented yet.
- `$license(id: MonoLicenseId)`
- `$markdownlint()`
- `$npm(name: string)`
- `$python(name: string)` Not implemented yet.
- `$static(from: string, to?: string, alwaysOverwrite = false)`
- `$vercel()` Not implemented yet.
- `$vscode()`

## Mono CLI

### `remold`

### `pull [id]`

### `commit [id]`

### `push [id]`

## Best Practices

1. This monorepo supports single branch for managing it's git-tracked entries. By default it uses the current branch of the root (mono) and throws if tracked entries are on different branch.
2. Each entry must be independent repository in a way that they should be standalone developable assuming access to possibly private packages. Therefore, assume each entry is its own repository and avoid relative file access outside the entry. Note that this monorepo supports monorepo dependencies via [Bun workspaces](https://bun.com/docs/pm/workspaces).

## Tech Stack

## Roadmap

1. Write a proper documentation both in code and as markdown. Add diagrams as well maybe?
2. Git branch management.
3. Better tracking reporting both by mono and git for all workspace directories.
4. Consider adding `.example` to mono env schema/builder for `.env.example`.
5. `bun mono push` safety checks.
6. Better key management via `keys` addon.
7. Add skills and so on so that AI and their IDEs know about the mono sturcture. Maybe introduce opinionated skills/MCPs as well?
8. Add flows for custom flows.
9. Gitleaks or Betterleaks?
10. Add cache for faster remold?
11. Maybe support multiple git remotes? Will probably be abandoned as many git providers provide mirroring.

## Contributor Code of Conduct

However you choose to contribute, please abide by our [Contributor Covenant 3.0 Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community a healthy and welcoming place.

## License

The code related to the monorepo skeleton (which excludes `./zones` that contain proprietary code) is licensed under the [MIT License](./LICENSE).
