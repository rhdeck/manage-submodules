# manage-submodules

Utilities and functions for managing git submodules relative to a node project

# Installation

```
yarn global add manage-submodules
```

# Executables

## smlist

List all your submodules in pretty-printed JSON

## smadd <name> <url>

Adds the git repository at `url` to the current structure at `submodules/name`

## smremove <name>

De-initializes the git submodule at `submodules/name` and cleans out that path. Pass `all` as name to run on all installed submodules.

## smpdate <name>

Updates the local repo at `submodules/name`. Pass `all` as name to run on all installed submodules.
