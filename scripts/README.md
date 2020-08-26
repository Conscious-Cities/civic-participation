
## Infrastructure

### VPC
VPC:
ipv4 cidr block: 10.0.0.0/24
enable dns hostnames

Subnet:
Auto-assign IPv4
ipv4 cidr block: 10.0.0.0/24

create intenet gateway and attach to vpc

Routes:
Add route:
- Destination: 0.0.0.0/0
- Target: Internet gateway

create security group for vpc
- Custom  TCP 4000  nodejs
- Custom  TCP 8888  nodeos
- SSH     TCP 22
- Custom  TCP 3000  react app


### Server
New EC2 instance
- Ubuntu 18.0.4 LTS server
- > 4Gb memory (t2.medium)
- > 20Gb storage
Add to VPC and use security group
Set to have public DNS

## CloudFront
New CloudFront distribution: Nodeos, React and Noedjs
- Origin: ec2 instance url
- Origin Protocol Policy: HTTP only
- HTTP port: 8888, 5000 and 4000
- Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- Query String Forwarding and Caching: Forward all, cache based on all
You can now connect with block explorer
`https://local.bloks.io/?nodeUrl=du0rtkac8px3u.cloudfront.net&systemDomain=eosio`