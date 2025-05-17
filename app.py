from flask import Flask, render_template, request, jsonify
import os
import subprocess
import json

app = Flask(__name__, template_folder='templates', static_folder='../static')

# Sample data - in a real app, this would come from a database or filesystem
TERRAFORM_MODULES = {
    'vpc': {
        'name': 'VPC',
        'description': 'AWS VPC with public and private subnets',
        'variables': [
            {'name': 'vpc_cidr', 'type': 'string', 'default': '10.0.0.0/16', 'description': 'CIDR block for the VPC'},
            {'name': 'public_subnets', 'type': 'list(string)', 'default': '["10.0.1.0/24", "10.0.2.0/24"]', 'description': 'CIDR blocks for public subnets'},
            {'name': 'private_subnets', 'type': 'list(string)', 'default': '["10.0.3.0/24", "10.0.4.0/24"]', 'description': 'CIDR blocks for private subnets'}
        ]
    },
    'ecs': {
        'name': 'ECS Cluster',
        'description': 'Amazon ECS Cluster with EC2 launch type',
        'variables': [
            {'name': 'cluster_name', 'type': 'string', 'default': 'my-ecs-cluster', 'description': 'Name of the ECS cluster'},
            {'name': 'instance_type', 'type': 'string', 'default': 't3.medium', 'description': 'EC2 instance type for ECS workers'},
            {'name': 'min_size', 'type': 'number', 'default': '1', 'description': 'Minimum number of instances'},
            {'name': 'max_size', 'type': 'number', 'default': '3', 'description': 'Maximum number of instances'}
        ]
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/modules', methods=['GET'])
def get_modules():
    return jsonify(TERRAFORM_MODULES)

@app.route('/api/plan', methods=['POST'])
def plan():
    data = request.json
    account = data.get('account')
    environment = data.get('environment')
    modules = data.get('modules', [])
    variables = data.get('variables', {})
    
    # In a real implementation, this would:
    # 1. Generate Terraform configuration files
    # 2. Run 'terraform init'
    # 3. Run 'terraform plan'
    # 4. Return the output
    
    return jsonify({
        'success': True,
        'output': f"Simulated plan for account {account} in {environment} with modules {', '.join(modules)}"
    })

@app.route('/api/apply', methods=['POST'])
def apply():
    data = request.json
    # Similar to plan but runs 'terraform apply'
    return jsonify({
        'success': True,
        'output': "Simulated apply completed"
    })

@app.route('/api/destroy', methods=['POST'])
def destroy():
    data = request.json
    # Runs 'terraform destroy'
    return jsonify({
        'success': True,
        'output': "Simulated destroy completed"
    })

if __name__ == '__main__':
    app.run(debug=True)