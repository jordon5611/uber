pipeline {
    agent any
    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        CLUSTER_NAME = 'uber-cluster'
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
        AWS_CLI_PATH = '/tmp/bin/aws'
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
                    sh 'echo "Hello"'
                    //sh 'docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                    //sh '''
                        // cd auth2
                        // docker build -t jordon5611/auth2 .
                        // docker push jordon5611/auth2
                        // cd ..
                        // cd driver
                        // docker build -t jordon5611/driver .
                        // docker push jordon5611/driver
                        // cd ..
                        // cd user
                        // docker build -t jordon5611/user .
                        // docker push jordon5611/user
                        // cd ..
                        // cd payment
                        // docker build -t jordon5611/payment .
                        // docker push jordon5611/payment
                        // cd ..
                        // cd rides
                        // docker build -t jordon5611/rides .
                        // docker push jordon5611/rides
                        // cd ..
                        
                    //'''
                }
            }
        }
        
        stage('Deploy to EKS') {
            steps {
                script {
                    // Use AWS credentials if not using the configured AWS CLI
                    withCredentials([string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                                     string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh """
                           $AWS_CLI_PATH eks update-kubeconfig --name $CLUSTER_NAME --region $AWS_DEFAULT_REGION
                           /tmp/skaffold dev
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
