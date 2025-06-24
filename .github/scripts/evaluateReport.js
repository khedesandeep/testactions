import fs from 'fs';

const THRESHOLD = 60; // Minimum acceptable score for any category
const report = JSON.parse(fs.readFileSync('report.json', 'utf8'));

let hasError = false;

report.forEach((entry) => {
  const { file, readability, maintainability, testability } = entry;

  if (
    readability < THRESHOLD ||
    maintainability < THRESHOLD ||
    testability < THRESHOLD
  ) {
    console.log(`❌ ${file}`);
    console.log(`   Readability:     ${readability}`);
    console.log(`   Maintainability: ${maintainability}`);
    console.log(`   Testability:     ${testability}`);
    hasError = true;
  }
});

if (hasError) {
  console.error('\n🚫 One or more files did not meet the minimum quality threshold.');
  process.exit(1); // ❌ Fail the build
} else {
  console.log('\n✅ All files passed quality checks.');
}

