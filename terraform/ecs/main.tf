resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-${var.cluster_name}"
  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-ecs-cluster"
    }
  )
}

resource "aws_launch_configuration" "ecs" {
  name_prefix          = "${var.environment}-ecs-"
  image_id             = data.aws_ami.ecs_optimized.id
  instance_type        = var.instance_type
  security_groups      = [aws_security_group.ecs.id]
  iam_instance_profile = aws_iam_instance_profile.ecs.name
  user_data            = <<-EOF
    #!/bin/bash
    echo ECS_CLUSTER=${aws_ecs_cluster.main.name} >> /etc/ecs/ecs.config
  EOF
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "ecs" {
  name                 = "${var.environment}-ecs-asg"
  launch_configuration = aws_launch_configuration.ecs.name
  min_size             = var.min_size
  max_size             = var.max_size
  desired_capacity     = var.min_size
  vpc_zone_identifier  = var.subnet_ids
  tags = concat(
    [
      {
        key                 = "Name"
        value               = "${var.environment}-ecs-asg"
        propagate_at_launch = true
      }
    ],
    local.asg_tags
  )
}