variable "AWS_SECRET_ACCESS_KEY" {}
variable "AWS_ACCESS_KEY_ID" {}

provider "aws" {
  region     = "eu-west-3"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
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

variable "BRANCH" {
  type = string
}

variable "COMMITHASH" {
  type = string
}

resource "aws_instance" "mpc" {
  ami           = "ami-064736ff8301af3ee"
  instance_type = "m6i.xlarge"
  user_data_base64 = base64encode("${templatefile("server.sh", {
      access_key_secret = var.AWS_SECRET_ACCESS_KEY
      access_key_id = var.AWS_ACCESS_KEY_ID
      git_branch = var.BRANCH
      commit_hash = var.COMMITHASH
  })}")
  user_data_replace_on_change = true
  key_name = "ssh" # Remove if not needed!
  vpc_security_group_ids = [aws_security_group.main.id]
  depends_on = [ aws_security_group.main ]
  associate_public_ip_address = true

  tags = {
    "Name" = "${var.BRANCH}"
  }
}
