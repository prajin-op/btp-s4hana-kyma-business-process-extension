#!/usr/bin/env groovy
@Library(['piper-lib', 'piper-lib-os']) _
node('kyma-agent'){
  stage('build'){
    deleteDir()
    withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
        checkout scm
        jsonfile = readJSON file: './chart/event-mesh.json'
	jsonfile['emname'] = 'kyma-cap-s4ems-op'
        jsonfile['namespace'] = 'refapps/kyma-cap-s4ems-op/event'
        writeJSON file: './chart/event-mesh.json', json: jsonfile
        bat '''
        sed -i "s/<DOCKER_REPOSITORY>/prajinop/g" Makefile
        sed -i -e "s/<domain>/c-4eb97ca.stage.kyma.ondemand.com/g" ./chart/values.yaml
        sed -i -e "s/<RELEASE_NAME>/kymareleaseop/g" ./chart/values.yaml
        sed -i -e "s,<DOCKER_ACCOUNT>,prajinop,g" ./chart/values.yaml
        sed -i -e "s/<CONNECTIVITY_SECRET\\>/kyma-cap-s4ems-connectivity-secret/g" ./chart/values.yaml
        sed -i -e "s/<base64encodeduser\\>/aTU3MjQyNg==/g" ./chart/values.yaml
        sed -i -e "s/<base_64_encoded_GIT_secret\\>/Z2hwX2JrS21WVUVDYVVEMllEQ1ZqTU1sS0ZldjdOZndNUDF6b2k2aA==/g" ./chart/values.yaml
	sed -i "s,<git_repo_url>,https://github.tools.sap/pipeline/kyma-cap-s4ems.git,g" ./chart/values.yaml
        sed -i "s/<branch>/master/g" ./chart/values.yaml
	make push-images
        '''
    }
  }
  stage('Deploy'){
    withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
    bat '''
    helm upgrade --install kymareleaseop ./chart -n prajin
    '''
    }
  }
  stage('Undeploy'){
    withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
    bat '''
    helm uninstall kymareleaseop -n prajin
    '''
    }
  }
}
