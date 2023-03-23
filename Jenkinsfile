#!/usr/bin/env groovy
@Library(['piper-lib', 'piper-lib-os']) _
node('kyma-agent'){
  try {
    stage('Build'){
      deleteDir()
	    checkout scm
	    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId:'githubbase64secret', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
	      bat '''
	      sed -i "s/<base64_encodeduser>/%USERNAME%/g" ./chart/values.yaml
      	      sed -i "s/<base_64_encoded_GIT_secret>/%PASSWORD%/g" ./chart/values.yaml
	      '''
      withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
      jsonfile = readJSON file: './chart/event-mesh.json'
      jsonfile['emname'] = 'kymaems'
      jsonfile['namespace'] = 'refapps/kymaems/event'
      writeJSON file: './chart/event-mesh.json', json: jsonfile
      xssecjson = readJSON file: './chart/xs-security.json'
      xssecjson['xsappname'] = 'kyma-s4ems'
      bat '''
      sed -i "s/<DOCKER_REPOSITORY>/prajinop/g" Jenkins_Makefile
      sed -i -e "s/<DOMAIN>/aaee644.kyma.ondemand.com/g" ./chart/values.yaml
      sed -i -e "s/<RELEASE_NAME>/s4kymarelease/g" ./chart/values.yaml
      sed -i -e "s,<DOCKER_ACCOUNT>,prajinop,g" ./chart/values.yaml
      sed -i -e "s/<CONNECTIVITY_SECRET>/kyma-cap-s4ems-connectivity-secret/g" ./chart/values.yaml
      sed -i -e "s/<namespace>/cicdkyma/g" ./chart/values.yaml
      sed -i "s,<git_repo_url>,https://github.tools.sap/I572426/kyma-cap-s4ems.git,g" ./chart/values.yaml
      sed -i "s,xsappname: kyma-cap-s4ems,xsappname: kyma-s4ems,g" ./chart/values.yaml
      sed -i "s/<git_branch>/master/g" ./chart/values.yaml
      sed -i "s,runAsNonRoot: true,runAsNonRoot: false,g" ./chart/charts/web-application/templates/deployment.yaml
      make push-images -f ./Jenkins_Makefile
      '''
      }
    }
  }
    stage('Deploy'){
      withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
      bat '''
      helm upgrade --install s4kymarelease ./chart -n cicdkyma --set-file event-mesh.jsonParameters=chart/event-mesh.json --set-file xsuaa.jsonParameters=chart/xs-security.json
      '''
      }
    }
    stage('Build Mock-Server'){
      withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
      bat '''
      git clone https://github.com/SAP-samples/btp-s4hana-kyma-business-process-extension.git -b mockserver
      sed -i -e "s/<DOMAIN_NAME>/aaee644.kyma.ondemand.com/g" ./chart/values.yaml
      sed -i -e "s/<RELEASE_NAME_OF_KYMAAPP>/s4kymamock/g" ./chart/values.yaml
      sed -i -e "s/<DOCKER_ACCOUNT>/prajinop/g" ./chart/values.yaml
      cds build --production
      pack build kymamock --path gen/srv --builder paketobuildpacks/builder:base
      docker tag mock:latest prajinop/kymamock:latest
      docker push prajinop/kymamock:latest
      '''
    }
  }
    stage('Deploy Mock-Server'){
      withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
        bat '''
        helm upgrade --install s4kymamock ./chart -n cicdkyma
        '''
      }
    }
    stage('Integration-tests'){
      checkout scm
      catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
        withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
		powershell 'Start-Sleep -Seconds 180'
		bat '''
		cd ./tests/testscripts/util
		kubectl get secret s4kymarelease-srv-auth -n cicdkyma -o json > appenv.json
		npm test     
          '''
        }
      }
    } 
    stage('Undeploy'){
      withKubeConfig([credentialsId: 'kubeconfig-i572426']) {
      bat '''
      helm uninstall s4kymamock -n cicdkyma
      helm uninstall s4kymarelease -n cicdkyma
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
