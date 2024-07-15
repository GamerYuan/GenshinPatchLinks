## Usage

### Requirements

1. Node.js 18+

### Using source code

```bash
npm install -g typescript # install typescript

npm install # install project dependencies

ts-node index.ts
```

### Using built binaries

Download the provided binaries under Releases \
Double click to execute the executable file

## Building

```bash
npm install -g pkg # install vercel pkg

npx tsc index.ts --outDir dist # compile typescript

pkg dist/index.js -t node18-win-x64 -out-path bin # package to exe

./bin/index.exe # execute
```

## Example output

```
Ver X.X.X (Full):
    Segment 1: ... (XXX GiB, md5: ...)
    Segment 2: ... (XXX GiB, md5: ...)
CN_VO: ... (XXX GiB, md5: ...)
EN_VO: ... (XXX GiB, md5: ...)
JP_VO: ... (XXX GiB, md5: ...)
KR_VO: ... (XXX GiB, md5: ...)
```
