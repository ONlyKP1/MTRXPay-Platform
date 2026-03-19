#!/usr/bin/env node
/**
 * Webhook Simulation Script
 * Simulate SumSub webhook calls for local development
 *
 * Usage:
 *   node scripts/simulate-webhook.js approved --user=<user-id>
 *   node scripts/simulate-webhook.js rejected --user=<user-id>
 *   node scripts/simulate-webhook.js pending --user=<user-id>
 *   node scripts/simulate-webhook.js --help
 */

require('dotenv').config();
const http = require('http');
const https = require('https');
const {
  approvedPayload,
  rejectedPayload,
  pendingPayload,
  applicantCreatedPayload,
  createSignedRequest,
  REJECTION_REASONS
} = require('../tests/fixtures/webhooks/sumsub.fixtures');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const WEBHOOK_PATH = '/api/webhooks/sumsub';

const EVENTS = {
  approved: {
    description: 'Simulate KYC approval (GREEN)',
    createPayload: approvedPayload
  },
  rejected: {
    description: 'Simulate KYC rejection (RED)',
    createPayload: (userId) => rejectedPayload(userId, REJECTION_REASONS.DOCUMENT_FRAUD)
  },
  pending: {
    description: 'Simulate KYC pending review (YELLOW)',
    createPayload: pendingPayload
  },
  created: {
    description: 'Simulate applicant created',
    createPayload: applicantCreatedPayload
  }
};

function printUsage() {
  console.log(`
Webhook Simulation Script
=========================

Usage:
  node scripts/simulate-webhook.js <event> [options]

Events:
  approved    - Simulate successful KYC verification (GREEN)
  rejected    - Simulate failed KYC verification (RED)
  pending     - Simulate KYC pending manual review (YELLOW)
  created     - Simulate applicant created event

Options:
  --user=<id>       User UUID to update (required for most events)
  --applicant=<id>  Custom applicant ID (default: sumsub-test-123)
  --url=<url>       Target URL (default: ${BASE_URL})
  --dry-run         Print payload without sending
  --help            Show this help message

Examples:
  # Approve a specific user
  node scripts/simulate-webhook.js approved --user=550e8400-e29b-41d4-a716-446655440000

  # Reject a user with dry run
  node scripts/simulate-webhook.js rejected --user=550e8400-e29b-41d4-a716-446655440000 --dry-run

  # Test against different URL
  node scripts/simulate-webhook.js approved --user=abc-123 --url=http://localhost:4000

Environment Variables:
  SUMSUB_WEBHOOK_SECRET  - Secret for signing (default: test-secret)
  API_URL                - Base API URL (default: http://localhost:3000)
`);
}

function parseArgs(args) {
  const options = {
    event: null,
    userId: null,
    applicantId: 'sumsub-test-123',
    url: BASE_URL,
    dryRun: false
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg.startsWith('--user=')) {
      options.userId = arg.split('=')[1];
    } else if (arg.startsWith('--applicant=')) {
      options.applicantId = arg.split('=')[1];
    } else if (arg.startsWith('--url=')) {
      options.url = arg.split('=')[1];
    } else if (!arg.startsWith('--') && !options.event) {
      options.event = arg;
    }
  }

  return options;
}

async function sendWebhook(url, payload, headers) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const body = JSON.stringify(payload);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const options = parseArgs(args);

  if (!options.event || !EVENTS[options.event]) {
    console.error(`Error: Unknown event "${options.event}"`);
    console.error(`Valid events: ${Object.keys(EVENTS).join(', ')}`);
    process.exit(1);
  }

  const eventConfig = EVENTS[options.event];
  const payload = eventConfig.createPayload(options.userId);

  // Override applicant ID if provided
  payload.applicantId = options.applicantId;

  const { payload: signedPayload, headers, signature } = createSignedRequest(payload);
  const targetUrl = `${options.url}${WEBHOOK_PATH}`;

  console.log('\n========================================');
  console.log(`Event: ${options.event.toUpperCase()}`);
  console.log(`Description: ${eventConfig.description}`);
  console.log(`Target: ${targetUrl}`);
  console.log(`User ID: ${options.userId || '(none - will lookup by applicant ID)'}`);
  console.log(`Applicant ID: ${payload.applicantId}`);
  console.log(`Signature: ${signature.substring(0, 20)}...`);
  console.log('========================================\n');

  console.log('Payload:');
  console.log(JSON.stringify(signedPayload, null, 2));
  console.log('');

  if (options.dryRun) {
    console.log('[DRY RUN] Webhook not sent');
    console.log('\nTo send this webhook, remove --dry-run flag');

    console.log('\n--- cURL command ---');
    console.log(`curl -X POST ${targetUrl} \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -H "X-Payload-Digest: ${signature}" \\`);
    console.log(`  -d '${JSON.stringify(signedPayload)}'`);
    return;
  }

  console.log('Sending webhook...\n');

  try {
    const response = await sendWebhook(targetUrl, signedPayload, headers);

    console.log(`Response Status: ${response.statusCode}`);
    console.log('Response Body:');

    try {
      const body = JSON.parse(response.body);
      console.log(JSON.stringify(body, null, 2));
    } catch {
      console.log(response.body);
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('\n✓ Webhook processed successfully');
    } else {
      console.log('\n✗ Webhook processing failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error sending webhook:', error.message);
    process.exit(1);
  }
}

main();
