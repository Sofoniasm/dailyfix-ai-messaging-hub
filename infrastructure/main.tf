terraform {
  required_providers {
    linode = {
      source  = "linode/linode"
      version = ">= 2.0.0"
    }
  }
}

provider "linode" {
  token = var.linode_token
}

# Jenkins master
resource "linode_instance" "jenkins_master" {
  label = "jenkins-master"
  region = var.region
  type   = var.instance_type
  image  = var.image
  root_pass = var.root_pass
}

# Jenkins agent
resource "linode_instance" "jenkins_agent" {
  label = "jenkins-agent"
  region = var.region
  type   = var.instance_type
  image  = var.image
  root_pass = var.root_pass
}

# LKE cluster
resource "linode_lke_cluster" "main" {
  label       = "dailyfix-lke"
  region      = var.region
  k8s_version = var.k8s_version
  pool {
    type  = var.lke_node_type
    count = 3
  }
}

output "jenkins_master_ip" {
  value = linode_instance.jenkins_master.ip_address
}

output "jenkins_agent_ip" {
  value = linode_instance.jenkins_agent.ip_address
}

output "lke_kubeconfig" {
  value = linode_lke_cluster.main.kubeconfig
  sensitive = true
}
