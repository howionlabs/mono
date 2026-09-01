# <sup><samp>howionlabs</samp></sup>mono

Howion's custom (hence quite opinionated) monorepo to manage all of its (public and private) [@howionlabs](https://git.howion.com/howionlabs) repositories and/or packages.

## Motivation

None of the existing monorepo tools or structures were good enough and always resulted writing custom scripts. Google's Bazel seemed like a solid choice but the complexity and management of it wasn't worth it. Therefore, hereby we represent our custom monorepo (skeleton) by us for us.

This monorepo is currently is being used by us therefore, especially `.mono.ts`, is subject to change.

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

## Addons

* `$author(author: MonoPerson | MonoFormattedPersonText)`
* `$biomejs()`
* `$contributor(contributor: MonoPerson | MonoFormattedPersonText)`
* `$env(...variables: string[])`
* `$git(uri: MonoGitURI)`
* `$github()` Not implemented yet.
* `$keys()` Not implemented yet.
* `$license(id: MonoLicenseId)`
* `$markdownlint()`
* `$npm(name: string)`
* `$static(from: string, to?: string, alwaysOverwrite = false)`
* `$vscode()`

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

1. Better mono documentation.
2. Git branch management.
3. Better tracking reporting both by mono and git for all workspace directories.
4. Consider adding `.example` to mono env schema/builder for `.env.example`.
5. `bun mono push` safety checks.
6. Better key management via `keys` addon.
7. Gitleaks or Betterleaks?
8. Add cache for faster remold?
9. Maybe support multiple git remotes? Will probably be abandoned as many git providers provide mirroring.

## License

The code related to the monorepo skeleton (which excludes `./zones` that contain proprietary code) is licensed under the [MIT License](./LICENSE).
