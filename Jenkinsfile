#!/usr/bin/env groovy
@Library(['piper-lib', 'piper-lib-os']) _
node('kyma-agent'){
  try {
    stage('Build'){
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
      sed -i -e "s/<CONNECTIVITY_SECRET>/kyma-cap-s4ems-connectivity-secret/g" ./chart/values.yaml
      sed -i -e "s/<base64encodeduser>/aTU3MjQyNg==/g" ./chart/values.yaml
      sed -i -e "s/<base_64_encoded_GIT_secret>/Z2hwX2JrS21WVUVDYVVEMllEQ1ZqTU1sS0ZldjdOZndNUDF6b2k2aA==/g" ./chart/values.yaml
      sed -i "s,<git_repo_url>,https://github.tools.sap/I572426/kyma-cap-s4ems.git,g" ./chart/values.yaml
      sed -i "s,xsappname: kyma-cap-s4ems,xsappname: kyma-cap-s4ems-op,g" ./chart/values.yaml
      sed -i "s/<branch>/master/g" ./chart/values.yaml	
      make push-images -f ./Jenkins_Makefile
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
    stage('Deploy-Mock-Server'){
      withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
      bat '''
      git clone https://github.com/SAP-samples/btp-s4hana-kyma-business-process-extension.git -b mockserver
      cds build --production
      pack build kymamock --path gen/srv --builder paketobuildpacks/builder:base
      docker tag mock:latest prajinop/kymamock:latest
      docker push prajinop/kymamock:latest
      sed -i -e "s/<DOMAIN_NAME>/c-4eb97ca.stage.kyma.ondemand.com/g" ./chart/values.yaml
      sed -i -e "s/<RELEASE_NAME_OF_KYMAAPP>/kymamock/g" ./chart/values.yaml
      sed -i -e "s/<DOCKER_ACCOUNT>/prajinop/g" ./chart/values.yaml
      helm upgrade --install kymamock ./chart -n prajin
      '''
    }
  }
    stage('Integration-tests'){
      checkout scm
      catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
        withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
          bat '''
          cd ./tests/testscripts/util
          npm test     
          '''
        }
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
  catch(e){
		echo 'This will run only if failed'
		currentBuild.result = "FAILURE"
}
  finally {
		//  emailext body: '$DEFAULT_CONTENT', subject: '$DEFAULT_SUBJECT', to: 'DL_5731D8E45F99B75FC100004A@global.corp.sap,DL_58CB9B1A5F99B78BCC00001A@global.corp.sap'
	}
}
