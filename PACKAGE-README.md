# How to create package that can be published to nexus npm

1. run `npm run build:package` to build the library (Don't forget to update the version in package.json with proper `-anritsu` suffix)

2. `cd dist`

3. `npm login --registry=http://rddocker:8081/repository/npmjs-anritsu`

4. `npm publish --registry=http://rddocker:8081/repository/npmjs-anritsu`
