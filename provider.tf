provider "aws" {
  region = "us-east-1"
  assume_role {
    role_arn = "arn:aws:iam::123456789012:role/OrganizationAccountAccessRole"
  }
  default_tags {
    tags = {
      Environment = "dev"
      ManagedBy   = "Terraform"
    }
  }
}