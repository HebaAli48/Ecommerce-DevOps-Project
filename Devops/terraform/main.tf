provider "aws" {
  region = var.aws_region
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"] # LTS release
  }
}

resource "aws_vpc" "elegance_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "Elegance-VPC"
  }
}

resource "aws_subnet" "elegance_public_subnet" {
  vpc_id                  = aws_vpc.elegance_vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "Elegance-Public-Subnet"
  }
}

resource "aws_internet_gateway" "elegance_gw" {
  vpc_id = aws_vpc.elegance_vpc.id

  tags = {
    Name = "Elegance-IGW"
  }
}

resource "aws_route_table" "elegance_rt" {
  vpc_id = aws_vpc.elegance_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.elegance_gw.id
  }

  tags = {
    Name = "Elegance-Route-Table"
  }
}

resource "aws_route_table_association" "elegance_rta" {
  subnet_id      = aws_subnet.elegance_public_subnet.id
  route_table_id = aws_route_table.elegance_rt.id
}

resource "aws_security_group" "elegance_sg" {
  name        = "elegance-sg"
  description = "Allow HTTP, API, and restricted SSH"
  vpc_id      = aws_vpc.elegance_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_access_cidr]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "API"
    from_port   = var.backend_port
    to_port     = var.backend_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Elegance-Security-Group"
  }
}

resource "aws_instance" "elegance_backend" {
  count                  = var.backend_instance_count
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.elegance_public_subnet.id
  vpc_security_group_ids = [aws_security_group.elegance_sg.id]

  tags = {
    Name = "Elegance-Backend-${count.index + 1}"
  }
}

resource "aws_instance" "elegance_frontend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.elegance_public_subnet.id
  vpc_security_group_ids = [aws_security_group.elegance_sg.id]

  tags = {
    Name = "Elegance-Frontend"
  }
}