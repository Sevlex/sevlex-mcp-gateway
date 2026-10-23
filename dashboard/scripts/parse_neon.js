const fs = require('fs');

const content = fs.readFileSync('C:/Users/meetp/.gemini/antigravity/brain/b525a58b-f257-4cf0-98d6-ed62ecc261e2/.system_generated/steps/8535/content.md', 'utf8');

// 1. Top Announcement Bar
const topBanner = content.match(/<a[^>]*class="[^"]*group relative z-50[^"]*"[^>]*>(.*?)<\/a>/s);
if (topBanner) {
  console.log('=== TOP BANNER ===');
  console.log(topBanner[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// 2. Navigation Header
const header = content.match(/<header[^>]*>(.*?)<\/header>/s);
if (header) {
  console.log('\n=== HEADER NAV ITEMS ===');
  const navItems = header[1].match(/<a[^>]*>(.*?)<\/a>|<button[^>]*>(.*?)<\/button>/gs) || [];
  navItems.forEach(item => {
    const text = item.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) console.log('  -', text);
  });
}

// 3. Hero Section
const hero = content.match(/<section[^>]*class="hero[^"]*"[^>]*>(.*?)<\/section>/s);
if (hero) {
  console.log('\n=== HERO SECTION ===');
  const h1 = hero[1].match(/<h1[^>]*>(.*?)<\/h1>/s);
  if (h1) console.log('H1:', h1[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  const badges = hero[1].match(/<span[^>]*class="[^"]*font-mono[^"]*"[^>]*>(.*?)<\/span>/gs) || [];
  badges.forEach(b => console.log('Badge:', b.replace(/<[^>]+>/g, ' ').trim()));
  const ctas = hero[1].match(/<a[^>]*class="[^"]*rounded-full[^"]*"[^>]*>(.*?)<\/a>/gs) || [];
  ctas.forEach(c => console.log('CTA Button:', c.replace(/<[^>]+>/g, ' ').trim()));
}

// 4. Inspect coding agents section
const agentSection = content.match(/Ready for coding agents[\s\S]{1,1500}/);
if (agentSection) {
  console.log('\n=== CODING AGENTS SECTION ===');
  console.log(agentSection[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 500));
}

// 5. Inspect Bento / Platform Section
const bentoSection = content.match(/Not just a Database[\s\S]{1,1500}/);
if (bentoSection) {
  console.log('\n=== BENTO PLATFORM SECTION ===');
  console.log(bentoSection[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 500));
}
