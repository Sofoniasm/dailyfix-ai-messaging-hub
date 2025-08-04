variable "linode_token" {
  description = "Linode API token"
  type        = string
}

variable "region" {
  description = "Linode region"
  type        = string
  default     = "us-east"
}

variable "instance_type" {
  description = "Linode instance type"
  type        = string
  default     = "g6-standard-1"
}

variable "image" {
  description = "Linode image"
  type        = string
  default     = "linode/ubuntu22.04"
}

variable "root_pass" {
  description = "Root password for instances"
  type        = string
}

variable "k8s_version" {
  description = "LKE Kubernetes version"
  type        = string
  default     = "1.33"
}

variable "lke_node_type" {
  description = "LKE node type"
  type        = string
  default     = "g6-standard-2"
}
