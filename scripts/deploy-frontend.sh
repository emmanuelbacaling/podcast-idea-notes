#!/usr/bin/env bash
# Builds the Vite app with the real backend URL baked in, then pushes it to an
# existing Amplify app/branch (created by terraform/) via a manual zip deploy —
# no GitHub connection needed.
#
# Usage: scripts/deploy-frontend.sh <api-endpoint-url> <amplify-app-id> [branch]
set -euo pipefail

cd "$(dirname "$0")/.."

API_ENDPOINT="${1:?Usage: deploy-frontend.sh <api-endpoint-url> <amplify-app-id> [branch]}"
APP_ID="${2:?Usage: deploy-frontend.sh <api-endpoint-url> <amplify-app-id> [branch]}"
BRANCH="${3:-main}"
PROFILE="${AWS_PROFILE:-personal}"
REGION="${AWS_REGION:-ap-southeast-1}"

export VITE_API_PATH="${API_ENDPOINT%/}/api"
echo "Building frontend with VITE_API_PATH=${VITE_API_PATH}"
npm run build

rm -f frontend-build.zip
(cd dist && zip -rq ../frontend-build.zip .)

echo "Creating Amplify deployment for app ${APP_ID} branch ${BRANCH}..."
DEPLOYMENT_JSON=$(aws amplify create-deployment \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH" \
  --profile "$PROFILE" \
  --region "$REGION")

JOB_ID=$(echo "$DEPLOYMENT_JSON" | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).jobId')
ZIP_UPLOAD_URL=$(echo "$DEPLOYMENT_JSON" | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).zipUploadUrl')

echo "Uploading build artifact..."
curl -sS -X PUT -T frontend-build.zip "$ZIP_UPLOAD_URL"

echo "Starting deployment job ${JOB_ID}..."
aws amplify start-deployment \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH" \
  --job-id "$JOB_ID" \
  --profile "$PROFILE" \
  --region "$REGION" >/dev/null

echo "Polling deployment status..."
STATUS="PENDING"
while [[ "$STATUS" != "SUCCEED" && "$STATUS" != "FAILED" ]]; do
  sleep 5
  STATUS=$(aws amplify get-job \
    --app-id "$APP_ID" \
    --branch-name "$BRANCH" \
    --job-id "$JOB_ID" \
    --profile "$PROFILE" \
    --region "$REGION" \
    --query 'job.summary.status' \
    --output text)
  echo "  status: $STATUS"
done

rm -f frontend-build.zip

if [[ "$STATUS" == "FAILED" ]]; then
  echo "Deployment failed." >&2
  exit 1
fi

echo "Deployment succeeded."
