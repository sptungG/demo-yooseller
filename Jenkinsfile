pipeline {
    environment {
      registryUrl = 'https://index.docker.io/v1'
      registryCredentialsId = 'jenkins-dockerhub'

      githubUrl = 'https://github.com/IMAXTEK/imax-smartsupplier-web.git'
      githubCredentialsId = 'jenkins-github'
    }

    agent any

    stages {
        stage('Clone code') {
          steps {
            sh "echo 'Cloning source code...'"

            git(
              credentialsId: githubCredentialsId,
              url: githubUrl,
              branch: "${env.GIT_BRANCH_NAME}"
            )
          }
        }

        stage ('Make environment variables') {
          steps {
            sh "echo 'Making environment variables...'"

            sh "${env.MAKE_ENV_SCRIPT}"
          }
        }

        stage('Build Docker Image') {
          steps {
            sh "echo 'Build & Tag latest and version images...'"

            script {
              dockerVerTagImage = docker.build("${env.IMAGE_TAG}", '.')
            }
          }
        }

        stage('Push Docker Image') {
          steps {
            sh "echo 'Pushing images to registry...'"

            script {
              docker.withRegistry('', "$registryCredentialsId") {
                dockerVerTagImage.push()
              }
            }
          }
        }

        stage('Deploy to server') {
          steps {
            sh "echo 'Deploying to server...'"

            sh "${env.DEPLOY_SCRIPT}"
          }
        }
    }
}
