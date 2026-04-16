---
name: render-deploy
description: Manage Render.com services — deploy, restart, get status, view logs, and rollback. Uses /op-secrets for API key retrieval. Invoke with /render-deploy for any Render.com operations.
---

# Render.com Deploy & Management

Skill for managing Render.com web services via the REST API. For credentials and secrets, use the `/op-secrets` skill. NEVER accept keys pasted in chat.

## Setup

### 1. Add your services

Edit `personal/render-deploy/SKILL.md` (gitignored) with your actual service IDs and URLs:

```
| Service | Service ID | URL | Environment |
|---------|-----------|-----|-------------|
| my-app-prod  | srv-xxxxxxxxxxxxxxxxx | https://www.my-app.com   | production |
| my-app-alpha | srv-xxxxxxxxxxxxxxxxx | https://alpha.my-app.com | dev/testing |
```

Find your Service ID in the Render dashboard → your service → Settings → Service ID.

### 2. Store credentials in 1Password

Store the Render API key in your 1Password vault, then retrieve it via `/op-secrets`:

```bash
export RENDER_API_KEY="$(op read "op://YourVault/Render/api-key")"
```

All API requests use Bearer token auth:
```
Authorization: Bearer $RENDER_API_KEY
```

## API Base URL

```
https://api.render.com/v1
```

## Common Operations

### 1. List Services

```bash
curl -s --request GET \
  --url 'https://api.render.com/v1/services?limit=20' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 2. Get Service Details

```bash
curl -s --request GET \
  --url "https://api.render.com/v1/services/$SERVICE_ID" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 3. Trigger Deploy

Deploy latest commit:
```bash
curl -s --request POST \
  --url "https://api.render.com/v1/services/$SERVICE_ID/deploys" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY" \
  --data '{"clearCache": false}'
```

Deploy specific commit:
```bash
curl -s --request POST \
  --url "https://api.render.com/v1/services/$SERVICE_ID/deploys" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY" \
  --data "{\"clearCache\": false, \"commitId\": \"$COMMIT_SHA\"}"
```

### 4. List Deploys

```bash
curl -s --request GET \
  --url "https://api.render.com/v1/services/$SERVICE_ID/deploys?limit=10" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 5. Get Deploy Status

```bash
curl -s --request GET \
  --url "https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 6. Cancel Deploy

```bash
curl -s --request POST \
  --url "https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID/cancel" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 7. Rollback to Previous Deploy

```bash
curl -s --request POST \
  --url "https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID/rollback" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 8. Restart Service

```bash
curl -s --request POST \
  --url "https://api.render.com/v1/services/$SERVICE_ID/restart" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 9. Get Service Logs

```bash
curl -s --request GET \
  --url "https://api.render.com/v1/services/$SERVICE_ID/logs?tail=100" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 10. Get Environment Variables

```bash
curl -s --request GET \
  --url "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY"
```

### 11. Update Environment Variable

```bash
curl -s --request PUT \
  --url "https://api.render.com/v1/services/$SERVICE_ID/env-vars/$ENV_VAR_KEY" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $RENDER_API_KEY" \
  --data "{\"value\": \"$NEW_VALUE\"}"
```

## Deploy Statuses

| Status | Meaning |
|--------|---------|
| `created` | Deploy queued |
| `build_in_progress` | Building |
| `update_in_progress` | Deploying |
| `live` | Successfully deployed and serving traffic |
| `deactivated` | Rolled back or superseded |
| `build_failed` | Build failed |
| `update_failed` | Deploy failed |
| `canceled` | Manually canceled |

## Workflow: Safe Production Deploy

1. **Deploy to staging first**: trigger deploy on your staging service
2. **Verify**: check deploy status reaches `live`, test the staging URL
3. **Deploy to production**: trigger deploy on your production service
4. **Monitor**: check deploy status, verify production URL
5. **Rollback if needed**: use rollback endpoint with the previous `live` deploy ID

## Safety Rules

- **Always deploy to staging before production**
- **Never deploy untested commits to production**
- **Check deploy status before declaring success** — wait for `live` status
- **Keep the previous deploy ID** before deploying, in case rollback is needed
- **Use /op-secrets** for all credential retrieval — never expose the API key
