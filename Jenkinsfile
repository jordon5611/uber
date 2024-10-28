pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIALS')
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        EKS_CLUSTER_NAME = 'uber-cluster'
        REGION = 'ap-south-1'  // Replace with your AWS region
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // stage('Build Docker Images') {
        //     steps {
        //         script {
        //             sh 'skaffold build'
        //         }
        //     }
        // }

        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_CREDENTIALS', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                        sh '''
                            cd auth2
                            docker build -t jordon5611/auth2 .
                            docker push jordon5611/auth2
                        '''
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    sh """
                        aws eks update-kubeconfig --name $EKS_CLUSTER_NAME --region $REGION
                        skaffold run
                    """
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

