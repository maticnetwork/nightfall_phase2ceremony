output "distribution_id" {
    description = "The frontend distribution id"
    value = aws_cloudfront_distribution.distribution.id
}

output "frontend_address" {
  description = "The frontend address"
  value       = aws_route53_record.www.name
}

output "backend_address" {
  description = "The backend address"
  value       = aws_route53_record.api.name
}
