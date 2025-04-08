output "backend_instances" {
  description = "Backend instance details"
  value = {
    ips       = aws_instance.elegance_backend[*].public_ip
    count     = length(aws_instance.elegance_backend)
    instance_ids = aws_instance.elegance_backend[*].id
  }
}

output "frontend_instance" {
  description = "Frontend instance details"
  value = {
    ip          = aws_instance.elegance_frontend.public_ip
    instance_id = aws_instance.elegance_frontend.id
  }
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.elegance_sg.id
}