pipeline {
    agent none
    
    /*environment {
        IMAGE_NAME = "oluwaseuna/juice-shop-app"
        IMAGE_TAG = "1.0"
        //SONAR_SCANNER_CLI = "sonarsource/sonar-scanner-cli:latest"
        //DOCKER_CREDENTIALS = credentials('docker_credentials') // Add Jenkins credential id for Docker login
        SONAR_TOKEN = credentials('sonar_token') // Add Jenkins credential id for SonarQube token
    }*/
    
    stages {
        stage('Cache') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                }
            }
            steps {
                script {
                    sh 'yarn install'
                }
            }
            post {
                always {
                    stash includes: 'node_modules/**/*, yarn.lock, .yarn/**/*', name: 'yarn_cache'
                }
            }
        }

        stage('Yarn Test') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                }
            }
            steps {
                unstash 'yarn_cache'
                script {
                    sh 'yarn install'
                    sh 'yarn test'
                }
            }
        }

        /*stage('Gitleaks') {
            agent {
                docker {
                    image 'zricethezav/gitleaks'
                    args '-u root'
                    reuseNode true
                }
            }
            steps {
                script {
                    sh 'gitleaks detect --verbose --source . -f json -r gitleaks.json'
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'gitleaks.json'
                }
            }
        }

        stage('NJSSCAN') {
            agent {
                docker {
                    image 'python'
                    reuseNode true
                }
            }
            steps {
                script {
                    sh 'pip3 install --upgrade njsscan'
                    sh 'njsscan --exit-warning . --sarif -o njsscan.sarif'
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'njsscan.sarif'
                }
            }
        }

        stage('Semgrep') {
            agent {
                docker {
                    image 'semgrep/semgrep'
                    reuseNode true
                }
            }
            environment {
                SEMGREP_RULES = "p/javascript"
            }
            steps {
                script {
                    sh 'semgrep ci --json --output semgrep.json'
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'semgrep.json'
                }
            }
        }

        stage('Retire.js') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                }
            }
            steps {
                unstash 'yarn_cache'
                script {
                    sh 'npm install -g retire'
                    sh 'retire --path . --outputformat json --outputpath retire.json'
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'retire.json'
                }
            }
        }

        stage('SonarQube Scan') {
            agent {
                docker {
                    image env.SONAR_SCANNER_CLI
                    reuseNode true
                }
            }
            steps {
                script {
                    sh "sonar-scanner -Dsonar.token=${env.SONAR_TOKEN}"
                }
            }
        }

        stage('Upload Reports') {
            agent {
                docker {
                    image 'python'
                    reuseNode true
                }
            }
            steps {
                script {
                    sh 'pip3 install requests'
                    sh 'python3 upload-reports.py gitleaks.json'
                    sh 'python3 upload-reports.py njsscan.sarif'
                    sh 'python3 upload-reports.py semgrep.json'
                    sh 'python3 upload-reports.py retire.json'
                }
            }
        }

        stage('Build Docker Image') {
            agent {
                docker {
                    image 'docker:27'
                    args '--privileged'
                    reuseNode true
                }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker_credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    }
                    sh "docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} ."
                    sh "docker push ${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                }
            }
        }*/
    }
}
