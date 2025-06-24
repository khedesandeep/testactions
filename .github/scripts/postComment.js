import fs from 'fs';
import fetch from 'node-fetch';

const report = JSON.parse(fs.readFileSync('report.json', 'utf8'));
const prNumber = process.env.GITHUB_REF?.match(/refs\/pull\/(\d+)\//)?.[1];
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;

if (!prNumber || !repo || !token) {
  console.log('❌ Missing required environment variables for PR comment');
  process.exit(0);
}

const body = generateCommentBody(report);
const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;

fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ body })
})
  .then((res) => res.json())
  .then((json) => {
    if (json.id) {
      console.log('✅ Comment posted to PR');
    } else {
      console.error('❌ Failed to post comment', json);
    }
  });

function generateCommentBody(report) {
  let comment = `## 🤖 CodebaseGuardian Report\n\n`;

  report.forEach(({ file, readability, maintainability, testability, summary, recommendations }) => {
    comment += `### 📄 \`${file}\`\n`;
    comment += `- **Readability**: ${readability}\n`;
    comment += `- **Maintainability**: ${maintainability}\n`;
    comment += `- **Testability**: ${testability}\n`;
    comment += `- **Summary**: ${summary}\n`;
    if (recommendations.length) {
      comment += `- **Recommendations**:\n`;
      recommendations.forEach((rec) => (comment += `  - ${rec}\n`));
    }
    comment += `\n---\n`;
  });

  return comment;
}
