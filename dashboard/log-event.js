// Append one event to .mate/activity_log.jsonl (the dashboard heartbeat).
// Usage: node dashboard/log-event.js <role> <start|end|info|dispatch> "<task>" [actor]
const fs = require('fs');
const path = require('path');
const [, , role, event, task, actor] = process.argv;
if (!role || !event) {
  console.error('usage: node dashboard/log-event.js <role> <start|end|info|dispatch> "<task>" [actor]');
  process.exit(1);
}
const line = JSON.stringify({
  ts: new Date().toISOString(),
  actor: actor || role,
  role,
  event,
  task: task || '',
}) + '\n';
fs.appendFileSync(path.join(__dirname, '..', '.mate', 'activity_log.jsonl'), line);
console.log('logged:', line.trim());
