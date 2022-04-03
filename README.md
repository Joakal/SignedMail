# SignedMail (signedmail)

Signed encrypted messages

## Tech / practices used:
- Vue 3
- Vuex 4
- Composition API
- Quasar 3

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```


### Fun headaches

Vue: Don't use key as a variable. It's a reserved word.

OpenPGP: Don't decrypt a private key and then use armor() to get the string as it'll return the key without the passphrase.