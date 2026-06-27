import fs from 'fs';
import path from 'path';

const repoPath = 'c:\\Users\\crezo\\OneDrive\\바탕 화면\\my_first_repo';
const privacyPath = path.join(repoPath, '개인정보처리방침.md');
const termsPath = path.join(repoPath, '이용약관.md');

const privacyContent = fs.readFileSync(privacyPath, 'utf-8');
const termsContent = fs.readFileSync(termsPath, 'utf-8');

const jsContent = `export const privacyPolicy = \`${privacyContent.replace(/`/g, '\\`')}\`;

export const termsOfService = \`${termsContent.replace(/`/g, '\\`')}\`;
`;

fs.writeFileSync(path.join(repoPath, 'src', 'constants', 'policies.js'), jsContent, 'utf-8');
console.log('Successfully generated src/constants/policies.js');
