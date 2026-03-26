---
name: aws-cli
description: AWS CLI setup, configuration, and management. For credentials, always use the /op-secrets skill — never accept pasted keys. Invoke with /aws-cli for any AWS operations.
---

# AWS CLI

Universal skill for AWS CLI setup and management. Credentials are always obtained securely via the `/op-secrets` skill.

## 1. Installation

```bash
aws --version
# Expected: aws-cli/2.x.x
```

If not installed:

```bash
# macOS (Homebrew)
brew install awscli

# macOS (official installer)
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install
```

## 2. Credentials — Always via /op-secrets

**NEVER** accept AWS keys pasted in chat. **NEVER** hardcode keys.

### Setup flow:

1. Invoke `/op-secrets` to obtain credentials from 1Password
2. The op-secrets skill will discover available AWS credentials automatically
3. Inject via subshell (values never appear in chat):

```bash
export AWS_ACCESS_KEY_ID="$(op read "op://<vault>/<item>/access-key-id")"
export AWS_SECRET_ACCESS_KEY="$(op read "op://<vault>/<item>/secret-access-key")"
export AWS_DEFAULT_REGION="$(op read "op://<vault>/<item>/region")"
```

Or use `op run` with an env file for batch injection:

```bash
op run --env-file /tmp/aws-secrets.env -- aws sts get-caller-identity
```

### If credentials are not found in 1Password:

Tell the user exactly what's needed:

> I need AWS credentials but couldn't find them in your accessible 1Password Vaults. Please add an item with these fields:
> - `access-key-id` — your AWS Access Key ID (e.g., `AKIAIOSFODNN7EXAMPLE`)
> - `secret-access-key` — your AWS Secret Access Key (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
> - `region` — default AWS region (e.g., `us-east-1`, `eu-west-1`)

## 3. Verify Connection

```bash
aws sts get-caller-identity
```

Expected output:

```json
{
    "UserId": "AIDAEXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/my-user"
}
```

## 4. Common Commands

### IAM (access management)

```bash
aws iam list-users
aws iam get-user
aws iam list-attached-user-policies --user-name <name>
```

### S3 (storage)

```bash
aws s3 ls
aws s3 cp <file> s3://<bucket>/<path>
aws s3 sync <local-dir> s3://<bucket>/<path>
aws s3 mb s3://<new-bucket>
```

### EC2 (compute)

```bash
aws ec2 describe-instances
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"
aws ec2 start-instances --instance-ids <id>
aws ec2 stop-instances --instance-ids <id>
```

### RDS (databases)

```bash
aws rds describe-db-instances
aws rds describe-db-clusters
```

### Lambda (serverless)

```bash
aws lambda list-functions
aws lambda invoke --function-name <name> output.json
```

### CloudWatch (monitoring)

```bash
aws cloudwatch list-metrics
aws logs describe-log-groups
aws logs tail <log-group> --follow
```

### ECS/EKS (containers)

```bash
aws ecs list-clusters
aws eks list-clusters
```

### Cost & Billing

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-03-01,End=2026-03-31 \
  --granularity MONTHLY \
  --metrics "BlendedCost"
```

## 5. Profile Management

```bash
# List all configured profiles
aws configure list-profiles

# View current configuration
aws configure list

# Use a specific profile for one command
aws s3 ls --profile <profile-name>

# Set default profile for the session
export AWS_PROFILE=<profile-name>
```

## 6. Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Unable to locate credentials` | No credentials configured | Use `/op-secrets` to inject credentials |
| `InvalidClientTokenId` | Wrong Access Key ID | Verify the key in 1Password, re-inject |
| `SignatureDoesNotMatch` | Wrong Secret Access Key | Re-inject via `/op-secrets` |
| `ExpiredToken` | Temporary token expired | Get new token or re-authenticate |
| `AccessDenied` | Insufficient IAM permissions | Check IAM policies for the user |
| `Could not connect to the endpoint URL` | Wrong region or network issue | Check `AWS_DEFAULT_REGION`, try another region |

### Debug

```bash
aws sts get-caller-identity --debug
aws configure list
```
