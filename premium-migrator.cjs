const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const replacements = [
  // Dark mode text conversions
  { from: /\btext-neutral-800\b/g, to: 'text-neutral-50' },
  { from: /\btext-neutral-700\b/g, to: 'text-neutral-200' },
  { from: /\btext-neutral-600\b/g, to: 'text-neutral-300' },
  
  // Background conversions
  { from: /\bbg-neutral-50\b/g, to: 'bg-neutral-900/30' },
  { from: /\bbg-neutral-100\b/g, to: 'bg-neutral-800/50' },
  { from: /\bborder-neutral-200\b/g, to: 'border-neutral-700/50' },
  { from: /\bborder-neutral-150\b/g, to: 'border-neutral-700/50' },
  { from: /\bborder-neutral-100\b/g, to: 'border-neutral-700/30' },
  
  // Convert standard white cards to glass panels
  { from: /\bbg-white border border-neutral-700\/30 shadow-md shadow-primary\/5 rounded-2xl\b/g, to: 'glass-panel rounded-2xl' },
  { from: /\bbg-white border border-neutral-700\/30 shadow-md shadow-primary\/5 rounded-3xl\b/g, to: 'glass-panel rounded-3xl' },
  { from: /\bbg-white border border-neutral-700\/50 shadow-md rounded-2xl\b/g, to: 'glass-panel rounded-2xl' },
  { from: /\bbg-white\b/g, to: 'bg-neutral-900/50' }, // Fallback for any other bg-white
  
  // Convert primary buttons to btn-premium
  { from: /\bbg-primary text-white hover:bg-primary-700 shadow-sm hover:shadow-md hover:-translate-y-0\.5 transition-all duration-200\b/g, to: 'btn-premium rounded-xl' },
  { from: /\bbg-neutral-800 hover:bg-neutral-900 text-white\b/g, to: 'btn-premium' },
  
  // Semantic bg adjustments for dark mode
  { from: /\bbg-primary-50\b/g, to: 'bg-primary-900/20' },
  { from: /\bbg-success-50\b/g, to: 'bg-success-900/20' },
  { from: /\bbg-warning-50\b/g, to: 'bg-warning-900/20' },
  { from: /\bbg-error-50\b/g, to: 'bg-error-900/20' },
  { from: /\bbg-accent-violet-50\b/g, to: 'bg-accent-violet-900/20' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Add framer motion import if not present and if it's a major component
  if (path.basename(filePath) === 'DashboardCustomer.jsx' && !content.includes('framer-motion')) {
      content = content.replace('import React', 'import React\nimport { motion } from "framer-motion";\n');
  }

  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(componentsDir);
console.log('Premium migration completed successfully.');
