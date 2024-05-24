terraform {
  required_version = ">= 0.12.0, < 2.0.0"
  backend "local" {
    path = "/Users/diarpall/terraform/terraform.tfstate"
  }
}