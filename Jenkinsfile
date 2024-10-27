pipeline {
    agent {
        docker {
            image 'amazonlinux:2' // Use Amazon Linux 2 as the base image
            args '-v /var/run/docker.sock:/var/run/docker.sock' // Mount Docker socket if needed
            customWorkspace '/var/jenkins_home/workspace/Uber-EKS-Deployment' // Ensure the correct workspace
        }
    }
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
        
        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        sudo yum install -y unzip curl
                        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                        unzip awscliv2.zip
                        sudo ./aws/install
                        rm -rf awscliv2.zip aws
                    '''
                }
            }
        }

        // stage('Build & Push Docker Images') {
        //     steps {
        //         script {
        //             sh 'echo "$DOCKER_HUB_CREDENTIALS" | docker login -u "$DOCKER_HUB_CREDENTIALS_USR" --password-stdin'
        //             sh '''
        //                 for service in auth2 driver user payment rides; do
        //                     cd $service
        //                     docker build -t jordon5611/$service .
        //                     docker push jordon5611/$service
        //                     cd ..
        //                 done
        //             '''
        //         }
        //     }
        // }

        stage('Configure AWS Credentials') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                                     string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh '''
                            export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                            export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                            aws eks update-kubeconfig --name $CLUSTER_NAME --region $AWS_DEFAULT_REGION
                        '''
                    }
                }
            }
        }

        stage('Deploy to EKS using Skaffold') {
            steps {
                script {
                    sh '''
                        if ! command -v skaffold &> /dev/null; then
                            curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
                            install skaffold /usr/local/bin/skaffold
                        fi
                        skaffold deploy
                    '''
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

