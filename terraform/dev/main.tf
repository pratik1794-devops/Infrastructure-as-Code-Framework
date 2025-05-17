module "vpc" {
  source              = "../../modules/vpc"
  environment         = "dev"
  vpc_cidr           = var.vpc_cidr
  public_subnets     = var.public_subnets
  private_subnets    = var.private_subnets
  availability_zones = var.availability_zones
  tags               = local.tags
}

module "ecs" {
  source        = "../../modules/ecs"
  environment  = "dev"
  cluster_name = var.ecs_cluster_name
  subnet_ids   = module.vpc.private_subnet_ids
  tags         = local.tags
}