
resource "aws_s3_bucket" "server" {
  bucket = "mpc-${var.BRANCH}"
  force_destroy = var.BRANCH == "main" ? false : true
}

data "aws_iam_policy_document" "server_policy" {
  statement {
    principals {
      type = "*"
      identifiers = ["*"]
    }
    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.server.arn,
      "${aws_s3_bucket.server.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_policy" "server_policy" {
  bucket = aws_s3_bucket.server.id
  policy = data.aws_iam_policy_document.server_policy.json
}

resource "aws_s3_bucket_cors_configuration" "server" {
  bucket = aws_s3_bucket.server.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }
}
