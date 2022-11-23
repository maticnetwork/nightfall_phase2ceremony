terraform {
  cloud {
    organization = "polygon-nightfall"

    workspaces {
        name = "mpc"
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

variable "AWS_SECRET_ACCESS_KEY" {}
variable "AWS_ACCESS_KEY_ID" {}

provider "aws" {
  region     = "eu-west-3"
}

resource "aws_security_group" "main" {
  egress = [
    {
      cidr_blocks      = [ "0.0.0.0/0", ]
      description      = ""
      from_port        = 0
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "-1"
      security_groups  = []
      self             = false
      to_port          = 0
    }
  ]
 ingress                = [
   {
     cidr_blocks      = [ "0.0.0.0/0", ]
     description      = ""
     from_port        = 22
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 22
   },
   {
     cidr_blocks      = [ "0.0.0.0/0", ]
     description      = ""
     from_port        = 3333
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 3333
    }
  ]
}


resource "aws_instance" "mpc" {
  ami           = "ami-064736ff8301af3ee"
  instance_type = "t3.large"
  user_data_base64 = base64encode("${templatefile("server.sh", {
      access_key_secret = var.AWS_SECRET_ACCESS_KEY
      access_key_id = var.AWS_ACCESS_KEY_ID
  })}")
  key_name = "ssh" # Remove if not needed!
  vpc_security_group_ids = [aws_security_group.main.id]
  depends_on = [ aws_security_group.main ]
}


# resource "aws_eip" "eip" {
#   vpc      = true
# }

# resource "aws_eip_association" "eip_assoc" {
#   instance_id   = aws_instance.mpc.id
#   allocation_id = aws_eip.eip.id
# }

output "instance_dns" {
  description = "The public ip"
  value       = aws_instance.mpc.public_dns
}
