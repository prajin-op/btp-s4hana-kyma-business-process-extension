# Getting Started
 
Welcome to S/4 HANA Extend Business logic on Kyma Scenario. 

## Steps to Build and Deploy the application

1. Connect S/4 HANA Cloud System To your global account
2. Configure Entelments 
3. Creating HDI Container in Cloud Foundry Space
4. Clone the project and Build the project
6. Push Image to helm repository
7. Configure the deployment files.
8. Deploy the project


## Connect S/4 HANA Cloud System to global account 
To connect S/4 HANA Cloud System, please follow this [Link:](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/2ffdaff0f1454acdb046876045321c91.html)

## Configure Entitlements
For this scenario you will need the following Entitelments.
1. HANA Cloud Instance
2. HDI Containers
3. EVENT MESH
4. SAP S/4HANA Cloud Extensibility Service
5. Cloud Foundry Runtime
6. Kyma Runtime

## Creating HDI Container in Cloud Foundry Space
This step pre-requires you to enable cloud foundry and create a space. 
1. Create HANA Cloud Instance.
2. Go to Services tab in you CF space.
3. Click on Services-> Service Market Place.
4. Search For SAP HANA Schema and Containers, And select it.
5. Create an instance with name ``kyma-hdi`` and plan ``hdi-shared``.
6. Once instance is created, Click on it and create a service key, Name it anything.
7. Download the service key, we will use it in the later steps.


## Clone the project and Build the project
1. Copy the project in your local system.
2. Open it in VS code.
4. Now Open terminal with Command ctrl+ j
5. In the root of project enter `npm i`. This will install all the dependencies
k apply -f ./k8s/createServices.yaml
	Cds build --production
	docker build -t kymademo .
	docker tag kymademo 0.0.0.0:5000/kymademo

	docker build ./app -t kymademoui -f Dockerfileui
	docker tag kymademoui 0.0.0.0:5000/kymademoui
	
	docker build . -t kymahdi -f db.Dockerfile
	docker tag kymahdi 0.0.0.0:5000/kymahdi 
	
	
	kubectl port-forward deployment/docker-registry -n demo 5000:5000 &
	docker push 0.0.0.0:5000/kymademo
	docker push 0.0.0.0:5000/kymademoui
	docker push 0.0.0.0:5000/kymahdi
 
 helm install ./ --generate-name
 
 





