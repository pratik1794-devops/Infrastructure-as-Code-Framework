document.addEventListener('DOMContentLoaded', function() {
    // Sample module data - in a real app, this would come from an API
    const modules = [
        {
            id: 'vpc',
            name: 'VPC',
            description: 'AWS VPC with public and private subnets',
            variables: [
                { name: 'vpc_cidr', type: 'string', default: '10.0.0.0/16', description: 'CIDR block for the VPC' },
                { name: 'public_subnets', type: 'list(string)', default: '["10.0.1.0/24", "10.0.2.0/24"]', description: 'CIDR blocks for public subnets' },
                { name: 'private_subnets', type: 'list(string)', default: '["10.0.3.0/24", "10.0.4.0/24"]', description: 'CIDR blocks for private subnets' }
            ]
        },
        {
            id: 'ecs',
            name: 'ECS Cluster',
            description: 'Amazon ECS Cluster with EC2 launch type',
            variables: [
                { name: 'cluster_name', type: 'string', default: 'my-ecs-cluster', description: 'Name of the ECS cluster' },
                { name: 'instance_type', type: 'string', default: 't3.medium', description: 'EC2 instance type for ECS workers' },
                { name: 'min_size', type: 'number', default: '1', description: 'Minimum number of instances' },
                { name: 'max_size', type: 'number', default: '3', description: 'Maximum number of instances' }
            ]
        },
        {
            id: 'rds',
            name: 'RDS PostgreSQL',
            description: 'Amazon RDS PostgreSQL database',
            variables: [
                { name: 'db_name', type: 'string', default: 'mydb', description: 'Database name' },
                { name: 'db_username', type: 'string', default: 'admin', description: 'Database admin username' },
                { name: 'db_password', type: 'string', default: '', description: 'Database admin password' },
                { name: 'instance_class', type: 'string', default: 'db.t3.medium', description: 'RDS instance type' },
                { name: 'allocated_storage', type: 'number', default: '20', description: 'Storage in GB' }
            ]
        },
        {
            id: 's3',
            name: 'S3 Bucket',
            description: 'Secure S3 bucket with versioning',
            variables: [
                { name: 'bucket_name', type: 'string', default: '', description: 'Unique bucket name' },
                { name: 'versioning', type: 'bool', default: 'true', description: 'Enable versioning?' },
                { name: 'encryption', type: 'bool', default: 'true', description: 'Enable server-side encryption?' }
            ]
        }
    ];

    const moduleGrid = document.getElementById('moduleGrid');
    const variablesForm = document.getElementById('variablesForm');
    const outputLog = document.getElementById('outputLog');
    const planBtn = document.getElementById('planBtn');
    const applyBtn = document.getElementById('applyBtn');
    const destroyBtn = document.getElementById('destroyBtn');
    const awsAccount = document.getElementById('awsAccount');
    const environment = document.getElementById('environment');

    let selectedModules = [];

    // Render module cards
    function renderModules() {
        moduleGrid.innerHTML = '';
        modules.forEach(module => {
            const isSelected = selectedModules.includes(module.id);
            const card = document.createElement('div');
            card.className = `module-card ${isSelected ? 'selected' : ''}`;
            card.dataset.id = module.id;
            card.innerHTML = `
                <h3>${module.name}</h3>
                <p>${module.description}</p>
            `;
            card.addEventListener('click', () => toggleModule(module.id));
            moduleGrid.appendChild(card);
        });
    }

    // Toggle module selection
    function toggleModule(moduleId) {
        const index = selectedModules.indexOf(moduleId);
        if (index === -1) {
            selectedModules.push(moduleId);
        } else {
            selectedModules.splice(index, 1);
        }
        renderModules();
        renderVariablesForm();
    }

    // Render variables form based on selected modules
    function renderVariablesForm() {
        variablesForm.innerHTML = '';
        
        if (selectedModules.length === 0) {
            variablesForm.innerHTML = '<p>Select modules to configure their variables.</p>';
            return;
        }

        selectedModules.forEach(moduleId => {
            const module = modules.find(m => m.id === moduleId);
            if (!module) return;

            const group = document.createElement('div');
            group.className = 'variable-group';
            group.innerHTML = `<h3>${module.name} Variables</h3>`;
            
            module.variables.forEach(variable => {
                const row = document.createElement('div');
                row.className = 'form-row';
                
                const label = document.createElement('label');
                label.textContent = `${variable.name} (${variable.type})`;
                label.title = variable.description;
                
                let input;
                if (variable.type === 'bool') {
                    input = document.createElement('select');
                    input.innerHTML = `
                        <option value="true">true</option>
                        <option value="false">false</option>
                    `;
                    input.value = variable.default;
                } else {
                    input = document.createElement('input');
                    input.type = variable.type === 'number' ? 'number' : 'text';
                    input.value = variable.default;
                    input.placeholder = variable.description;
                }
                
                row.appendChild(label);
                row.appendChild(input);
                group.appendChild(row);
            });
            
            variablesForm.appendChild(group);
        });
    }

    // Simulate Terraform plan
    planBtn.addEventListener('click', function() {
        if (!awsAccount.value || !environment.value || selectedModules.length === 0) {
            appendOutput('Please select AWS account, environment, and at least one module.');
            return;
        }

        appendOutput(`Initializing Terraform for ${awsAccount.value} account in ${environment.value}...`);
        appendOutput('Loading modules...');
        
        selectedModules.forEach(moduleId => {
            const module = modules.find(m => m.id === moduleId);
            appendOutput(`- ${module.name}`);
        });
        
        setTimeout(() => {
            appendOutput('\nTerraform plan output:');
            appendOutput('Plan: 12 to add, 0 to change, 0 to destroy.');
            appendOutput('\nTerraform plan completed successfully. Review above and click "Apply Configuration" to proceed.');
            
            applyBtn.disabled = false;
            destroyBtn.disabled = false;
        }, 1500);
    });

    // Simulate Terraform apply
    applyBtn.addEventListener('click', function() {
        appendOutput('\nApplying Terraform configuration...');
        
        setTimeout(() => {
            appendOutput('aws_vpc.main: Creating...');
            appendOutput('aws_subnet.public[0]: Creating...');
            appendOutput('aws_subnet.public[1]: Creating...');
            appendOutput('aws_subnet.private[0]: Creating...');
            appendOutput('aws_subnet.private[1]: Creating...');
            
            setTimeout(() => {
                appendOutput('aws_vpc.main: Creation complete after 10s');
                appendOutput('aws_subnet.public[0]: Creation complete after 5s');
                appendOutput('aws_subnet.public[1]: Creation complete after 5s');
                appendOutput('aws_subnet.private[0]: Creation complete after 5s');
                appendOutput('aws_subnet.private[1]: Creation complete after 5s');
                
                appendOutput('\nApply complete! Resources: 12 added, 0 changed, 0 destroyed.');
            }, 2000);
        }, 1000);
    });

    // Simulate Terraform destroy
    destroyBtn.addEventListener('click', function() {
        appendOutput('\nDestroying Terraform-managed infrastructure...');
        
        setTimeout(() => {
            appendOutput('aws_vpc.main: Destroying...');
            appendOutput('aws_subnet.public[0]: Destroying...');
            appendOutput('aws_subnet.public[1]: Destroying...');
            appendOutput('aws_subnet.private[0]: Destroying...');
            appendOutput('aws_subnet.private[1]: Destroying...');
            
            setTimeout(() => {
                appendOutput('aws_vpc.main: Destruction complete after 10s');
                appendOutput('aws_subnet.public[0]: Destruction complete after 5s');
                appendOutput('aws_subnet.public[1]: Destruction complete after 5s');
                appendOutput('aws_subnet.private[0]: Destruction complete after 5s');
                appendOutput('aws_subnet.private[1]: Destruction complete after 5s');
                
                appendOutput('\nDestroy complete! Resources: 12 destroyed.');
                
                applyBtn.disabled = true;
                destroyBtn.disabled = true;
            }, 2000);
        }, 1000);
    });

    // Helper function to append output
    function appendOutput(text) {
        outputLog.textContent += text + '\n';
        outputLog.scrollTop = outputLog.scrollHeight;
    }

    // Initialize the UI
    renderModules();
    renderVariablesForm();
});