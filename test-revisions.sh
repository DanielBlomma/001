#!/bin/bash

# Login and get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

echo "Got token: ${TOKEN:0:50}..."

# Get page 2
PAGE_DATA=$(curl -s http://localhost:3001/api/pages/2 \
  -H "Authorization: Bearer $TOKEN")

echo "Current page content length: $(echo $PAGE_DATA | python3 -c "import sys, json; print(len(json.load(sys.stdin).get('content', '')))")"

# Update page to trigger revision
curl -s -X PUT http://localhost:3001/api/pages/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"<p>First revision test at '$(date +%H:%M:%S)'</p>"}' \
  > /dev/null

echo "First update done"

sleep 1

# Update again
curl -s -X PUT http://localhost:3001/api/pages/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"<p>Second revision test at '$(date +%H:%M:%S)'</p>"}' \
  > /dev/null

echo "Second update done"

sleep 1

# Update third time
curl -s -X PUT http://localhost:3001/api/pages/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"<p>Third revision test at '$(date +%H:%M:%S)'</p>"}' \
  > /dev/null

echo "Third update done"

# Check revisions
echo "Checking revisions..."
curl -s http://localhost:3001/api/pages/2/revisions \
  -H "Authorization: Bearer $TOKEN" | \
  python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Found {len(data)} revisions')"
