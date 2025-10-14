const fs = require('fs');
const path = require('path');

function cleanComments(content) {
  // Remove JSDoc comments (/** ... */)
  content = content.replace(/\/\*\*[\s\S]*?\*\//g, '');
  
  // Remove multi-line comments (/* ... */)
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove single line comments (//)
  content = content.replace(/^\s*\/\/.*$/gm, '');
  
  // Remove empty lines that were left after comment removal
  content = content.replace(/^\s*$/gm, '');
  
  // Remove multiple consecutive empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Clean up extra whitespace
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return content;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleaned = cleanComments(content);
    
    // Only write if content actually changed
    if (cleaned !== content) {
      fs.writeFileSync(filePath, cleaned);
      console.log(`Cleaned: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      processFile(filePath);
    }
  });
}

// Process all source directories
const directories = [
  'src/lib',
  'src/interface',
  'src/consts',
  'src/types',
  'src/hooks',
  'src/components',
  'src/app'
];

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Processing directory: ${dir}`);
    processDirectory(dir);
  }
});

console.log('Complete comment cleaning finished!');
