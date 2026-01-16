const fs = require('fs');
const path = require('path');
const dataFolder = '../studies/data';
const indexPath = path.join(dataFolder, 'index.json');
const allFiles = fs.readdirSync(dataFolder);
const jsonFiles = allFiles.filter(file => file.endsWith('.json') && file !== 'index.json');
jsonFiles.sort();
fs.writeFileSync(indexPath, JSON.stringify(jsonFiles, null, 2));
console.log(`✅ Generated index.json with ${jsonFiles.length} files in ${dataFolder}`);
