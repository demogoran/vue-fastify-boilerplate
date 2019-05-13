const babel = require('@babel/core');
const fs = require('fs');
const plugin = require('./plugin');

const filePath = `${__dirname}/../../server/controllers/MusicController.js`;
const code = fs.readFileSync(filePath).toString()

const result = babel.transform(code, {
  plugins: [plugin],
  __pathname: filePath,
  code: true,
  ast: false,
});

const transformedCode = result.code;
//console.log('ast', JSON.stringify(result.ast, false, 4));

fs.writeFileSync(`${__dirname}/out.js`, transformedCode);