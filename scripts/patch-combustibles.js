const fs = require('fs');
const p = require('path').join(__dirname, '../components/Combustibles.tsx');
let t = fs.readFileSync(p, 'utf8');

const start = t.indexOf("      case 'aditec':");
const end = t.indexOf("      case 'diesel':");
const replacement = `      case 'aditec':
        return <AditecPanel />;
      case 'gasolinas':
        return <GasolinasSlider />;
`;
t = t.slice(0, start) + replacement + t.slice(end);

t = t.replace(
  /const AditecAgent[\s\S]*?^const tabs =/m,
  'const tabs =',
);

fs.writeFileSync(p, t);
console.log('patched');
