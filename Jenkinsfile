pipeline {
    agent any
    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        CLUSTER_NAME = 'uber-cluster'
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'ls -asl'
            }
        }
        
        stage('Build & Push Docker Images') {
            steps {
                script {
                    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                    sh 'skaffold build'
                }
            }
        }
        
        stage('Deploy to EKS') {
            steps {
                script {
                    // Use AWS credentials if not using the configured AWS CLI
                    withCredentials([string(credentialsId: 'aws-eks-credentials', variable: 'AWS_ACCESS_KEY_ID'),
                                     string(credentialsId: 'aws-eks-secret', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh """
                           aws eks update-kubeconfig --name $CLUSTER_NAME --region $AWS_DEFAULT_REGION
                           skaffold run
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
