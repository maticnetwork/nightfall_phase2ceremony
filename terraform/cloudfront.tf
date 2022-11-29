resource "aws_cloudfront_distribution" "distribution" {
  origin {
    domain_name              = aws_s3_bucket.server.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.server.bucket_regional_domain_name
    origin_path = "/website"
  }

  default_root_object = "index.html"
  enabled             = true
  is_ipv6_enabled     = true
  aliases = var.BRANCH == "main" ? [ "ceremony.polygon-nightfall.io" ] : [ "${var.BRANCH}.ceremony.polygon-nightfall.io" ]

  default_cache_behavior {
    compress = false
    viewer_protocol_policy = "allow-all"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" // default policy id
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" // default policy id
    response_headers_policy_id = "5cc3b908-e619-4b99-88e5-2cf7f45965bd" // default policy id
    target_origin_id = aws_s3_bucket.server.bucket_regional_domain_name
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:950711068211:certificate/bf2723a4-6eb3-45a4-be75-f0032d712d7d"
    ssl_support_method = "sni-only"
  }

    restrictions {
        geo_restriction {
            locations = []
            restriction_type = "none"
        }
    }
}

resource "aws_route53_record" "www" {
  zone_id = "Z05413741GQORWY8FTPNF"
  name    = "%{ if var.BRANCH != "main" }${var.BRANCH}.ceremony.polygon-nightfall.io%{ else }ceremony.polygon-nightfall.io%{ endif }"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
