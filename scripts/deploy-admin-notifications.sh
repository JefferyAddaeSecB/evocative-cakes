#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.notifications"
PROJECT_REF_FILE="${ROOT_DIR}/supabase/.temp/project-ref"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

if [[ -n "${SUPABASE_PROJECT_REF:-}" ]]; then
  PROJECT_REF="${SUPABASE_PROJECT_REF}"
elif [[ -f "${PROJECT_REF_FILE}" ]]; then
  PROJECT_REF="$(tr -d '[:space:]' < "${PROJECT_REF_FILE}")"
else
  echo "Missing project ref. Set SUPABASE_PROJECT_REF or link the project with Supabase CLI."
  exit 1
fi

REQUIRED_VARS=(
  RESEND_API_KEY
  RESEND_FROM_EMAIL
  REPLY_TO_EMAIL
  ADMIN_NOTIFICATION_EMAIL
)

for required_var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!required_var:-}" ]]; then
    echo "Missing required environment variable: ${required_var}"
    exit 1
  fi
done

SECRET_ARGS=(
  "RESEND_API_KEY=${RESEND_API_KEY}"
  "RESEND_FROM_EMAIL=${RESEND_FROM_EMAIL}"
  "REPLY_TO_EMAIL=${REPLY_TO_EMAIL}"
  "ADMIN_NOTIFICATION_EMAIL=${ADMIN_NOTIFICATION_EMAIL}"
)

OPTIONAL_VARS=(
  ADMIN_NOTIFICATION_PHONE
  TWILIO_ACCOUNT_SID
  TWILIO_AUTH_TOKEN
  TWILIO_FROM_NUMBER
)

for optional_var in "${OPTIONAL_VARS[@]}"; do
  if [[ -n "${!optional_var:-}" ]]; then
    SECRET_ARGS+=("${optional_var}=${!optional_var}")
  fi
done

echo "Setting Supabase secrets for project ${PROJECT_REF}..."
supabase secrets set --project-ref "${PROJECT_REF}" "${SECRET_ARGS[@]}"

echo "Deploying admin-notifications function..."
supabase functions deploy admin-notifications --project-ref "${PROJECT_REF}"

if [[ -z "${VITE_SITE_URL:-}" ]]; then
  echo "Reminder: VITE_SITE_URL is not set in your environment. Update your frontend env before testing live emails."
fi

echo "Notification secrets updated and function deployed."
