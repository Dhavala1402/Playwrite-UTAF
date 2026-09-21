pipeline {
    agent any

    tools {
    nodejs 'NodeJS-26'
}

    environment {
        CI = 'true'
        NODE_ENV = 'test'
        PLAYWRIGHT_BROWSERS_PATH = '0'  
        BASE_URL = 'https://playwright.dev'
    }

    options {
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node dependencies...'
                script {
                    if (isUnix()) {
                        sh 'node -v && npm -v'
                        sh 'npm ci'
                    } else {
                        bat 'node -v && npm -v'
                        bat 'npm ci'
                    }
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Installing Playwright browsers...'
                script {
                    if (isUnix()) {
                        sh 'npx playwright install --with-deps'
                    } else {
                        bat 'npx playwright install'
                    }
                }
            }
        }

        stage('Static Checks') {
            parallel {
                stage('Type Check') {
                    steps {
                        echo 'Running TypeScript type check...'
                        script {
                            if (isUnix()) {
                                sh 'npm run type-check'
                            } else {
                                bat 'npm run type-check'
                            }
                        }
                    }
                }

                stage('Lint') {
                    steps {
                        echo 'Running ESLint...'
                        script {
                            if (isUnix()) {
                                sh 'npm run lint'
                            } else {
                                bat 'npm run lint'
                            }
                        }
                    }
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo 'Running Playwright test suite...'
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Archiving test and report artifacts...'
            archiveArtifacts artifacts: 'test-results/**, playwright-report/**, allure-results/**', allowEmptyArchive: true
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Please review test output and artifacts.'
        }
    }
}
