
resource "aws_security_group" "lb" {
  vpc_id = aws_vpc.main.id
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
  subnets            = aws_subnet.public[*].id

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
  vpc_id   = aws_vpc.main.id

  health_check {
    path = "/healthcheck"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_target_group_attachment" "tg-attachment" {
  count = length(var.public_subnets)
  target_group_arn = aws_lb_target_group.tg.arn
  target_id        = aws_instance.mpc[count.index].id
  port             = 3333
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_lb.lb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.BRANCH == "main" ? var.CERTIFICATE_ARN_BACKEND_MAIN : var.CERTIFICATE_ARN_BACKEND_DEV

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
