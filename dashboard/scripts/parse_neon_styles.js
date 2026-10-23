const fs = require('fs');
const content = fs.readFileSync('C:/Users/meetp/.gemini/antigravity/brain/b525a58b-f257-4cf0-98d6-ed62ecc261e2/.system_generated/steps/8535/content.md', 'utf8');

// Inspect buttons classes
console.log('--- BUTTON STYLES ---');
const btnClasses = content.match(/class="[^"]*inline-flex[^"]*"/g) || [];
[...new Set(btnClasses)].slice(0, 10).forEach(c => console.log(c));

// Inspect Card/Bento classes
console.log('\n--- CARD & BENTO CONTAINER STYLES ---');
const cardClasses = content.match(/class="[^"]*(?:border|rounded|bg-)[^"]*"/g) || [];
const uniqueCard = [...new Set(cardClasses)].filter(c => c.includes('rounded-') && c.includes('border'));
uniqueCard.slice(0, 10).forEach(c => console.log(c));

// Inspect Colors and Typography
console.log('\n--- KEY STYLING TOKENS ---');
const colors = content.match(/text-\[#[0-9a-fA-F]+\]|bg-\[#[0-9a-fA-F]+\]|border-gray-new-\d+|text-gray-new-\d+|bg-gray-new-\d+|bg-green-\d+|text-green-\d+/g) || [];
console.log('Top unique color tokens:', [...new Set(colors)].slice(0, 20));
