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
     from_port        = 443
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 443
    },
    {
      cidr_blocks      = [ "0.0.0.0/0", ]
      description      = ""
      from_port        = 80
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "tcp"
      security_groups  = []
      self             = false
      to_port          = 80
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
  instance_type = "t3.large"
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

resource "aws_route53_record" "www" {
  zone_id = "Z05413741GQORWY8FTPNF"
  name    = "%{ if var.BRANCH != "main" }${var.BRANCH}.ceremony.polygon-nightfall.io%{ else }ceremony.polygon-nightfall.io%{ endif }"
  type    = "A"
  ttl     = 300
  records = [aws_instance.mpc.public_ip]
}


output "instance_dns" {
  description = "The public ip"
  value       = aws_route53_record.www.name
}

