
data "aws_vpc" "default" {
  default = true
} 

data "aws_subnets" "example" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_subnet" "example" {
  for_each = toset(data.aws_subnets.example.ids)
  id       = each.value
}


resource "aws_security_group" "lb" {
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
     from_port        = 443
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 443
   }
  ]
}

resource "aws_lb" "lb" {
  name               = "mpc-${var.BRANCH}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = [for subnet in data.aws_subnet.example : subnet.id]

  enable_deletion_protection = false

  tags = {
    Environment = "${var.BRANCH}"
  }
}

resource "aws_lb_target_group" "tg" {
  name     = "mpc-${var.BRANCH}-lb-tg"
  port     = 3333
  protocol = "HTTP"
  protocol_version = "HTTP1"
  vpc_id   = data.aws_vpc.default.id

  health_check {
    path = "/healthcheck"
  }
}

resource "aws_lb_target_group_attachment" "tg-attachment" {
  target_group_arn = aws_lb_target_group.tg.arn
  target_id        = aws_instance.mpc.id
  port             = 3333
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_lb.lb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.BRANCH == "main" ? "arn:aws:acm:eu-west-3:950711068211:certificate/2ec392a8-4e0c-4edc-a050-9b673cebcf88" : "arn:aws:acm:eu-west-3:950711068211:certificate/b26d35d0-219d-4883-91b5-686cdd2d5953"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg.arn
  }
}


resource "aws_route53_record" "api" {
  zone_id = "Z05413741GQORWY8FTPNF"
  name    = "%{ if var.BRANCH != "main" }api-${var.BRANCH}.ceremony.polygon-nightfall.io%{ else }api-ceremony.polygon-nightfall.io%{ endif }"
  type    = "A"

  alias {
    name = aws_lb.lb.dns_name
    zone_id = aws_lb.lb.zone_id
    evaluate_target_health = false
  }
}
