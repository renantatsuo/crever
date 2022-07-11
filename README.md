# Crever

Crever is a scraping bot to check for new products on the Clevertech swag store.

## Installing

Clone the repo and run
```bash
npm install
```

## Running
You must provide some information to be able to run:

| Arg                      | CLI                  | ENV_VAR                |
|--------------------------|----------------------|------------------------|
| password                 | `-p` or `--password` | SWAG_PASSWORD          |
| store url                | `-u` or `--url`      | SWAG_URL               |
| interval (default is 10) | `-i` or `--interval` | CHECK_INTERVAL_SECONDS |

### using cli arguments

```bash
npm start -- -p example -u https://example.com -i 5
```

### using env vars

Create a `.env` file in the root project folder.
```bash
SWAG_PASSWORD=example
SWAG_URL=https://example.com
CHECK_INTERVAL_SECONDS=5
```

## Custom diff handling

Whenever a diff occurs, a callback will be called with the diff.

You can change this callback in the file `onDiff.js` and do whatever you want with the diff information (e.g. sending an email or notification).

Check out [diffjs](https://github.com/kpdecker/jsdiff) for further information about the diff.
