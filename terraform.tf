terraform {
  backend "remote" {
    organization = "polygon-nightfall"

    workspaces {
      prefix = "mpc-"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}
