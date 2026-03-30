import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = ['README.md', 'CLAUDE.md', '.env.example', 'repo-contract.yaml', 'AGENT-PROGRESS.md'];
const envExample = readFileSync(join(root, '.env.example'), 'utf8');
const readme = readFileSync(join(root, 'README.md'), 'utf8');

for (const file of requiredFiles) {
  test(`${file} exists`, () => {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  });
}

test('.env.example documents Supabase and Judge0 variables', () => {
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_URL=/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_ANON_KEY=/);
  assert.match(envExample, /SUPABASE_SERVICE_ROLE_KEY=/);
  assert.match(envExample, /JUDGE0_API_URL=/);
  assert.match(envExample, /JUDGE0_API_KEY=/);
});

test('README documents the challenge/review platform context', () => {
  assert.match(readme, /Judge0/i);
  assert.match(readme, /Review/i);
  assert.match(readme, /Next\.js/i);
});
