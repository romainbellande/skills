# Lint and format tools by stack

Suggest the row for the detected stack; the user may swap or decline. Never install a tool whose config is already present. `{staged_files}` is a lefthook template variable that expands to the staged files, so each hook touches only what's about to be committed.

| Stack | Lint | Format | Install |
|---|---|---|---|
| Node / TypeScript | ESLint — `eslint {staged_files}` | Prettier — `prettier --write {staged_files}` | `npm i -D eslint prettier` (plus `typescript-eslint` for TS) |
| Python | Ruff — `ruff check --fix {staged_files}` | Ruff — `ruff format {staged_files}` | `uv add --dev ruff` (or `pip install ruff`) |
| Go | golangci-lint — `golangci-lint run {staged_files}` | gofmt — `gofmt -l {staged_files}` | `go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest`; gofmt ships with Go |
| Ruby | RuboCop — `rubocop {staged_files}` | RuboCop — `rubocop -A {staged_files}` | `gem install rubocop` |
| Rust | clippy — `cargo clippy` | rustfmt — `cargo fmt` | part of the Rust toolchain |
| Swift | SwiftLint — `swiftlint lint` | swiftformat — `swiftformat {staged_files}` | `brew install swiftlint swiftformat` |
| Kotlin | ktlint — `ktlint {staged_files}` | ktlint — `ktlint -F {staged_files}` | `brew install ktlint` |
| Java | Spotless — `spotless:check` | Spotless — `spotless:apply` | Gradle / Maven plugin |
| C / C++ | clang-tidy — `clang-tidy {staged_files}` | clang-format — `clang-format --dry-run --Werror {staged_files}` | `brew install llvm` or distro package |
| Other / multi-language | — | Prettier — `prettier --write {staged_files}` | `npm i -D prettier` |

Format-only fallback: when the stack has no conventional formatter or the user declines a per-stack one, Prettier covers most languages.
