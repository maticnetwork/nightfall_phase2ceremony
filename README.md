# Nightfall3 MPC ceremony (phase 2)

## Why

Zero-knowledge proofs require a trusted setup. This setup generates a so-called "toxic waste" which
could potentially allow to create fake proofs. To avoid this, a ceremony needs to be held where this
setup is generated via multi-party computation (MPC).

For the second release of Nightfall, the team decided upon three main priorities:

- Make the MPC easily orchestrated, with an MPC server
- Make this infrastructure easy to deploy and manually test, following the principles of
  Infrastructure as Code and GitOps
- Make the contributions as easy as possible through a website that anyone can visit and contribute
  with 1 click

# How can I contribute

If you simply want to contribute to the ceremony, just visit the live page at
`ceremony.polygon-nightfall.io` and follow the instructions. It will take just a few minutes. If you
want to know more, follow along...

## Architecture

We make use of Terraform and Terraform Cloud in order to manage the provisioning of AWS resources.
Under the `terraform` folder you can see the following:

- The default VPC, subnets and internet gateway on `eu-west-3` are used
- An EC2 instance is created, together with a load balancer and target group. The script `server.sh`
  is passed into it, which clones this repo and starts the server you can find on the `serve`
  folder. An existent certificate is used on the load balancer listener. A route53 record is added
  to an existing Zone ID.
- A cloudfront distribution is also provisioned and set up with an existent certificate. Its record
  is also added to an existent Zone ID through route53.
- An S3 bucket is created

These services are used with branch names thanks to Github Actions. Each new `pull_request` creates
new resources, so manual testing can be performed on these branches without messing up with the
ongoing `mpc` in `main`.

## Github actions

As mentioned, Github Actions is the CI/CD pipeline that will do the following:

- Deploy or update the infrastructure everytime there's a new `pull_request`, or a new `commit` on
  an open `pull_request`
- Copy the first contribution of each circuit into the S3 bucket
- Build the `react` frontend and copy the static page to the S3 bucket
- Invalidate the cloudfront cache

# How can I clone this

As you can see on the `terraform` folder, a lot of things are assumed right now. Like the ACM
certificate ARNs, route53 hosted zones, and cloudfront distribution zones. It also assumes you can
use the default VPC and subnets.

However, and while we will work hard to make this infrastructure as plug-and-play, you can still
clone this repo and make changes to these values, providing your own and deploying this MPC as
yours.

Just keep in mind the following needed secrets:

- `AUTH_KEY` - Some random string (it can be anything, really) to protect your beacon routes on the
  backend. This is a work in progress.
- `AWS_ACCESS_KEY_ID` - Obviously you need to provide an AWS access key for your own AWS environment
- `AWS_SECRET_ACCESS_KEY` - Same thing
- `TF_API_TOKEN` - The terraform cloud token

You also need to set up `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in Terraform cloud as
`variable sets`.

# TODO

- Make a better frontend, this one looks like my one-year-old twins christmas drawing
- Make a ticketing system to allow people to report they're contributing, and allow others to wait
  (as contributions need to be synchronous)
- Have proper unit and e2e testing
