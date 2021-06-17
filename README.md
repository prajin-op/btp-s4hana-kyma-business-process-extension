# SAP S/4HANA Extended Business Process Scenario in Kyma
## Description
The main intent of this scenario is to complement an existing business process in an SAP solution – currently SAP S/4HANA with additional business process steps. This involves adding major logic and/or additional data and goes beyond simple UI changes.

This application showcases:

- Building applications on SAP Business Technology Platform (BTP) using [SAP Cloud Application Programming Model(CAP)](https://cap.cloud.sap/docs/)
- Consuming events from SAP S/4HANA on premise using [SAP Event Mesh](https://help.sap.com/viewer/bf82e6b26456494cbdd197057c09979f/Cloud/en-US/df532e8735eb4322b00bfc7e42f84e8d.html)
- Consuming REST APIs from SAP S/4HANA on premise using SAP Business Technology Platform Connectivity Service
- Building and deploying a function in [SAP BTP Kyma Runtime, Serverless](https://kyma-project.io/docs/components/serverless)

## Business Scenario

A business scenario is used to showcase how to build a S/4 HANA on premise extension Application on SAP BTP, Kyma runtime.

John who is an employee of Business Partner Validation Firm iCredible, which is a third-party vendor of ACME Corporation would like to get notifications whenever new Business Partners are added in the S/4HANA backend system of ACME Corporation. John would then be able to review the Business Partner details in his extension app. He would proceed to visit the Business Partner’s registered office and do some background verification. John would then proceed to update/validate the verification details into the extension app. Once the details are verified, the Business Partner gets activated in the S/4HANA system of ACME Corporation.

- Custom extension application that works independently from S/4HANA.

- Changes in S/4 communicated via events in real time to extension application.

- Compute intensive processing available on demand (using serverless).

- Vendor personnel needs access to only custom app

## Architecture

### Solution Diagram

![solution diagram](./documentation/images/solutionDiagram.jpg)

The Business Partner Validation application is developed using the SAP Cloud Application programming Model (CAP) and runs on the SAP BTP,  Kyma runtime. It consumes platform services like SAP Event Mesh, SAP HANA and Connectivity. The events occuring in S/4 HANA on premise are inserted into the Event Mesh queue. The application running in Cloud Foundry is notified on events, consumes them from the queue and inserts the event data into the HANA database. The Business Partner Validation Application uses S/4 HANA REST API's to read additional Business Partner Data from the S/4 HANA system. in a next step, the Business Partner Validation App uses an event-driven approach as well by firing events that get consumed by Serverless Application which posts the relevant business partner data to S/4 HANA on premise system using S4HANA oData api's.

## Requirements
* SAP S/4HANA on premise system.
* SAP Business Technology Platform account

### For local development you would require the following:
* [Node js](https://nodejs.org/en/download/)
* [kubectl command line tool (kubectl)]( https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)
* [Visual Studio Code](https://cap.cloud.sap/docs/get-started/in-vscode)
* [cds-dk](https://cap.cloud.sap/docs/get-started/)
* [SQLite ](https://sqlite.org/download.html)
* [Docker](https://www.docker.com/products/docker-desktop)

### Entitlements

The application requires below set of SAP Business Technology Platform Entitlements/Quota

| Service                           | Plan       | Number of Instances |
|-----------------------------------|------------|:-------------------:|
| Event Mesh                        | default    |          1          |
| SAP HANA Schemas & HDI Containers | hdi-shared |          1          |
| SAP HANA Cloud                    | hana       |          1          |
| Kyma runtime                      |            |          1          |
| Destination Service               |            |          1          |
| Connectivity Service              |            |          1          |

## Configuration

### Step 1: [S/4HANA Enable OData Service for business partner](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/configure-oData-Service/README.md)

### Step 3: [Setup connectivity between S/4HANA system, SAP BTP](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/cloud-connector/README.md)

### Step 4: Build and deploy the CAP application

#### Kubeconfig setup
1. Load the kyma dashboard opened above
2. Click on the right side corner on the user icon
3. Click on get KubeConfig
4. Goto the folder where you have downloaded the kubeconfig file
5. Right click and copy the file
6. Goto my computer
7. Create folder and name it kubectl
8. Paste the file there, This file is to be replaced when then token is expired
9. Set environment variable for kubectl with the value as path for the folder
10. Set environment variable for KUBECONFIG with the value as path for the pasted config file
11. Execute `kubectl get pods` to test the setup

#### Steps to deploy locally

- Open terminal in VSCode
- Run `cds watch`

#### Steps to deploy the application on kyma runtime

1. Edit package.json file in the root folder with the corresponding queue name and destination name.
2. Build the application
   `cds build --production`  
3. Build and push images:
   `docker build --pull --rm -f "db.Dockerfile" -t <dockerrepo>/kymahdi:latest "."`
   `docker build --pull --rm -f "Dockerfile" -t <dockerrepo>/kymacaps4ems:latest "."`
   `docker build --pull --rm -f "app\Dockerfileui" -t <dockerrepo>/kymacaps4ui:latest "app"`
   `docker push <dockerrepo>/kymahdi:latest`
   `docker push <dockerrepo>/kymacaps4ems:latest `
   `docker push <dockerrepo>/kymacaps4ui:latest`
4. Open helmcharts/values.yaml
   - replace the hdi secrets
   - Change System Name with the system name of your S/4  HANA, its something you have created in the subaccount
   - Change hdiimage:"value" with the value you have give for your docker for hdi container 
   - change capimage to CAP app's image name 
   - change uiimage to UI image's image name 
   - change value of your kyma gateway for capapp
   - change value of your kyma gateway for uiapp
   - replace gitusername with encoderd username
   - replace gitpassword with encoded password 
   - replace giturl with url of your git repository 
   - replace gitbranch with the name of your branch
   - replace namespace with the kyma namespace where the application is inteded to be deployed.
   - replace release name in cpapp and uiapp

3. Deploy the application

	Navigate to helmcharts folder

   `helm install <release name> ./ -n <namespace>`

4. Navigate to Event Mesh Subscription
5. Open your emclient and create a new queue with name as serverless. Add <em namespace>/SalesService/d41d/BusinessPartnerVerified topic as subscription to the created queue.
6. Navigate to webhooks tab and Click on Create Webhook
7. Enter Subscription name.
8. Click on Queue Name drop down and select one "serverless" at end
9. Get the API Rule of Serverless Function from kyma console and Paste it in Webhook URL
10. Click on Create
11. Click on actions dropdown and trigger handshake.

### Step 6: [Configure event based communication between S/4HANA and Event Mesh](https://help.sap.com/viewer/810dfd34f2cc4f39aa8d946b5204fd9c/1809.000/en-US/fbb2a5980cb54110a96d381e136e0dd8.html)


## Demo script
   
2. In the kyma console find the URL for the app ` BusinessPartnerValidation-ui` - this is the launch URL for the Business Partner Validation application.

3. Launch the URL in a browser.

4. Click on Business Partner Validation tile

![fiori tile](./documentation/images/fioriLaunchpad.JPG)

5. The list of BusinessPartners along with their verification status gets displayed. 

![BP list](./documentation/images/BPListView.JPG)

6. Login to the S/4HANA on-premise system

![S/4HANA login](./documentation/images/GuiLogin.JPG)

7. Enter transaction code 'bp'

![bp transaction](./documentation/images/BPtransaction.JPG)

8. Click on Person

![person](./documentation/images/person.png)

9. Provide first name, last name for the business partner
![name](./documentation/images/name.png)

10. Provide the address
![address](./documentation/images/bpaddress.png)

11. Move to the status tab and check mark the 'Central Block' lock. Save the BP. This will create a new Business Partner 

![lock](./documentation/images/lock.png)

12. Now go back to the BusinessPartnerValidation application to see if the new BusinessPartners has come on the UI

![new bp](./documentation/images/bpNew.png)

13. Go to the details page for the new BusinessPartner. Click on edit.

![edit bp](./documentation/images/editBP.png)

14. Change the Verification Status to VERIFIED. You can also edit the street name, postal code also if needed. Save the data. 

![edit values](./documentation/images/editValue.png)

15. Open S/4HANA system, bp transaction. Search for the newly created bp

![search bp](./documentation/images/searchBP.png)

16. Double click on the BP

![click bp](./documentation/images/clickBP.png)

17. You can see that the central Block lock has been removed 

![release lock](./documentation/images/releasedLock.png)

18. The serverless application has also uploaded a QR code for the address details of the BP to the S/4HANA system. 
You can view this by clicking on the icon in the top left corner. You will have to give permission for downloading the image. 

![attachment List](./documentation/images/attachmentList.png)

19. You can also notice that in the BusinessPartner Validation UI, the status is now set as COMPLETED.

## Known Issues

No known issues.

## How to Obtain Support

In case you find a bug, or you need additional support, please [open an issue](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/issues/new) here in GitHub.

## License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
