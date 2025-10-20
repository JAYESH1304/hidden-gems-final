const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load YAML config
const config = yaml.load(fs.readFileSync('folders.yml', 'utf8'));

// Create folders
config.folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Created folder: ${folder}`);
  }
});

// Create files
config.files.forEach(file => {
  const folder = path.dirname(file);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '', 'utf8');
    console.log(`Created file: ${file}`);
  }
});
