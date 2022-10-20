# Deploy the Application to SAP BTP Kyma Runtime

 **[NOTE]:** Instance of SAP BTP connectivity service (connectivity-proxy plan) is created to establish a secure tunnel between SAP BTP Kyma environment and a system in your On-Premise network. This provisioning must be done only once in your cluster.                                                   [Refer](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/0c035010a9d64cc8a02d872829c7fa75.html) for more details.
 If the connectivity service is not provisioned after creation of cluster by your administrator, you can do it by running the below command

     kubectl apply -f ./script/connectivity.yaml -n <NAME_SPACE>

 **[NOTE]:** If connectivity service instance resides in a different space, then create the secret for connectivity service by running the below command.
 Make sure you update the `connectivity-secret.yaml` file with the required encoded values before secret creation.
 
     kubectl apply -f ./script/connectivity-secret.yaml -n <NAME_SPACE>

1. Navigate to root folder of the cloned source code.

2. Open Makefile and edit the value for <DOCKER_ACCOUNT>.

3. Build the applications and also create and push the docker images to docker account by executing the following script:

    ```shell
    make push-images
    ```

4. Open the `chart/values.yaml` file:

    Edit the domain of your cluster, so that the URL of your CAP service can be generated. You can use the pre-configured domain name for your Kyma cluster:

    ```shell
    kubectl get configmap -n kube-system shoot-info -ojsonpath='{.data.domain}'
    ```

5. For a private container registry create a secret for your Docker repository and replace the value of <DOCKER_SECRET> with the created secret name:

    imagePullSecret: name: <DOCKER_SECRET>

6. Find all <DOCKER_ACCOUNT> and replace all with your docker account/repository.

7. Find all <CONNECTIVITY_SERVICE_SECRET> and replace all with your connectivity secret name.

8. Find all <RELEASE_NAME> and replace all with your Helm Chart's release name. This can be any name of your choice.

9. Find all <DB_SECRET_NAME> and replace all with the DB secret name. The DB secret name will be `caphana`, if the [db script](../../../script/db.sh) is not modified.

10. Replace <gitusername> with encoded username.

11. Replace <gitpassword> with encoded password.

12. Replace <giturl> with url of your git repository.

13. Replace <gitbranch> with the name of your branch.

14. Run the following command to deploy your application:

    ```shell
    helm upgrade --install <RELEASE_NAME> ./chart -n <NAMESPACE>
    ```
