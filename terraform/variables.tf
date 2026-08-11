variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-southeast-1"
}

variable "aws_profile" {
  description = "AWS CLI profile to use"
  type        = string
  default     = "personal"
}

variable "app_name" {
  description = "Amplify app name"
  type        = string
  default     = "podcast-idea-notes"
}
