terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

# No `repository`/`access_token` — this app is deployed via manual zip upload
# (scripts/deploy-frontend.sh), not GitHub-connected CI/CD.
resource "aws_amplify_app" "app" {
  name     = var.app_name
  platform = "WEB"

  # Client-side (React Router) routing: fall back to index.html for any
  # extensionless path, including ones with a trailing slash — Amplify's
  # built-in SPA fallback only covers non-trailing-slash paths.
  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>"
    target = "/index.html"
    status = "200"
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.app.id
  branch_name = "main"
  framework   = "React"
  stage       = "PRODUCTION"
}
