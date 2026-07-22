const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const replacements = [
  // Typography and colors
  { from: /\bslate-/g, to: 'neutral-' },
  { from: /\bblue-/g, to: 'primary-' },
  { from: /\bindigo-/g, to: 'primary-' },
  { from: /\bemerald-/g, to: 'success-' },
  { from: /\bred-/g, to: 'error-' },
  { from: /\bamber-/g, to: 'warning-' },
  { from: /\byellow-/g, to: 'warning-' },
  { from: /\bpurple-/g, to: 'accent-violet-' },
  { from: /\brose-/g, to: 'error-' },
  
  // Specific component and card styling (adding rounded-2xl, subtle shadows)
  { from: /\brounded-lg\b/g, to: 'rounded-xl' },
  { from: /\brounded-md\b/g, to: 'rounded-lg' },
  { from: /\bshadow-sm\b/g, to: 'shadow-md shadow-primary\/5' },
  
  // Fintech styling updates
  // Card backgrounds
  { from: /\bbg-white border border-neutral-200\b/g, to: 'bg-white border border-neutral-100 shadow-md shadow-primary/5 rounded-2xl' },
  
  // Buttons
  { from: /\bbg-primary-600 hover:bg-primary-700\b/g, to: 'bg-primary text-white hover:bg-primary-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' },
  { from: /\bbg-error-600 hover:bg-error-700\b/g, to: 'bg-error text-white hover:bg-error-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' },
  { from: /\bbg-neutral-100 hover:bg-neutral-200\b/g, to: 'bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-200' },
  
  // Data Vis colors (Recharts usually uses hex string in props, e.g. stroke="#3b82f6")
  { from: /"#3b82f6"/g, to: '"var(--color-primary-500)"' },
  { from: /"#10b981"/g, to: '"var(--color-success-500)"' },
  { from: /"#ef4444"/g, to: '"var(--color-error-500)"' },
  { from: /"#f59e0b"/g, to: '"var(--color-warning-500)"' },
  { from: /"#64748b"/g, to: '"var(--color-neutral-500)"' },
  { from: /"#8b5cf6"/g, to: '"var(--color-accent-violet-500)"' },
  { from: /"#0ea5e9"/g, to: '"var(--color-secondary-500)"' },
  { from: /"#f43f5e"/g, to: '"var(--color-error-400)"' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }

  // Ensure button styling consistency
  content = content.replace(/className="([^"]*)"/g, (match, classes) => {
    let newClasses = classes;
    // Replace text colors that might be legacy
    newClasses = newClasses.replace(/\btext-white\b/g, 'text-white');
    
    // Fintech button rule 6 & 7 padding and hover logic
    if (newClasses.includes('px-4') && newClasses.includes('py-2') && newClasses.includes('bg-primary')) {
        newClasses = newClasses.replace(/\bpx-4\b/, 'px-6').replace(/\bpy-2\b/, 'py-3');
    }
    
    // Add transition if interactive and not present
    if ((newClasses.includes('hover:') || newClasses.includes('cursor-pointer') || match.includes('button')) && !newClasses.includes('transition-all')) {
        if (!newClasses.includes('transition')) {
             newClasses += ' transition-all duration-200';
        }
    }
    
    return `className="${newClasses}"`;
  });

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
console.log('Migration completed successfully.');
