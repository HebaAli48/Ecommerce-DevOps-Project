variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "backend_instance_count" {
  description = "Number of backend instances to launch"
  type        = number
  default     = 2
}

variable "ssh_access_cidr" {
  description = "CIDR block allowed to SSH access"
  type        = string
  default     = "0.0.0.0/0"
}

variable "backend_port" {
  description = "Port for backend API access"
  type        = number
  default     = 8000
}