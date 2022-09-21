# Deploy the Application to SAP BTP Kyma Runtime

1. Navigate to root folder of the cloned source code.

1. Open Makefile and Edit the value for DOCKER_ACCOUNT.

2. Build the applications and also create and push the docker images to docker account by executing the below script:

    ```shell
    make push-images
    ````

3. Open chart/values.yaml
      
    Edit the domain of your cluster, so that the URL of your CAP service can be generated. You can use the preconfigured domain name for your Kyma cluster:

    ```shell  
    kubectl get gateway -n kyma-system kyma-gateway -o jsonpath='{.spec.servers[0].hosts[0]}'
    ```

4. For a private container registry - Create a secret for your Docker repository and replace the value of DOCKER_SECRET with the created secret name.
   
    imagePullSecret: name: <DOCKER_SECRET>

    public container registry - Create a dummy secret and replace the value of DOCKER_SECRET with the created secret name

    ```shell
    kubectl create secret generic <DOCKER_SECRET> -n <NAMESPACE>
    ```

5. Find all <DOCKER_ACCOUNT> and replace all with your docker account/repository.

6. Find all <RELEASE_NAME> and replace all with your Helm Chart's release name. This can be any name of your choice.

7. Edit the following for function deployment

8. Replace gitusername with encoded username.

9.  Replace gitpassword with encoded password.

10. Replace giturl with url of your git repository.

11. Replace gitbranch with the name of your branch.

12. Run the following command to deploy your application

    ```shell 
    helm upgrade --install <RELEASE_NAME> ./chart -n <NAMESPACE>
    ```
    **[NOTE]:** Instance of SAP BTP connectivity service (connectivity-proxy) plan is created to establish a secure tunnel between SAP BTP Kyma environment and a system in your On-Premise network. This provisioning must be done only once in your cluster.                                                   [Refer](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/0c035010a9d64cc8a02d872829c7fa75.html) for more details.
