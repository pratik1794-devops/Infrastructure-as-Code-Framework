variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "app-cluster"
}

variable "instance_type" {
  description = "EC2 instance type for ECS workers"
  type        = string
  default     = "t3.medium"
}

variable "min_size" {
  description = "Minimum number of instances"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of instances"
  type        = number
  default     = 3
}

variable "subnet_ids" {
  description = "List of subnet IDs for ECS instances"
  type        = list(string)
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "tags" {
  description = "Additional tags for all resources"
  type        = map(string)
  default     = {}
}