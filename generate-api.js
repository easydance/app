// "generate-api": "openapi-generator-cli generate -i https://easydance-dev.oddacoding.net/api/api-json -g typescript-axios -o node_modules/@easydance/apis --remove-operation-id-prefix --model-package models --additional-properties=npmName=restClient,supportsES6=true,npmVersion=6.9.0,withInterfaces=true && cd ./node_modules/@easydance/apis && npm run build && cd ../../../"
const fs = require('fs');
const { exec } = require('child_process');

const swaggerUrl = 'https://easydance-dev.oddacoding.net/api/api-json';
const options = [
    `-i ${swaggerUrl}`,
    `-g typescript-angular`,
    `-o src/app/apis`,
    `--remove-operation-id-prefix`,
    `--model-package model`,
    `--skip-validate-spec`,
    `--additional-properties=${['npmName=restClient', 'supportsES6=true', 'npmVersion=6.9.0', 'withInterfaces=true'].join(',')}`,
];
// const buildCommand = 'cd ./node_modules/@easydance/apis && npm run build && cd ../../../';
const buildCommand = '';
const command = [`openapi-generator-cli generate ${options.join(' ')}`, buildCommand].filter(c => c).join(' && ');

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        throw error;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        throw error;
    }
    console.log(`stdout: ${stdout}`);
    // const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }));
    // pkg.dependencies['@easydance/apis'] = 'file:./node_modules/@easydance/apis';
    // fs.writeFileSync('./package.json', JSON.stringify(pkg, undefined, 4), { encoding: 'utf-8' });
}).addListener('error', (err) => {
    throw err;
});
