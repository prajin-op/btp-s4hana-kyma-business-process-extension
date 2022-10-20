# Configure Your Subaccount in SAP BTP

In this section, you will set up the subaccount in SAP BTP for developing the Easy Franchise application.

**Prerequisite:** You must have an administrator role for SAP BTP.

1. Log in to the SAP BTP cockpit and select your global account.

2. In the **Account Explorer**, choose **Create** &rarr; **Subaccount**.

   ![create](images/createSubAccount.png)

3. In the **Create Subaccount** wizard, enter the following values:

   *  In the **Display Name** field, enter your subaccount name.
   *  In the **Subdomain** field, enter your subdomain ID.
   *  In the **Region** field, select the Cloud Foundry region of your choice: Amazon Web Service, Google Cloud Platform or Microsoft Azure.
   *  In the **Parent** field, select your global account.


      ![create](images/createSubAccount2.png)

   * For categorizing your subaccount you can add some labels. Choose **Create**.

5. Add entitlements:

   1. Choose **Entitlements** &rarr; **Configure Entitlements** &rarr; **Add Service Plan**.
   ![entitlement](images/entitlements1.png)

   2. Search for **SAP HANA Cloud** and select the **hana** service plan. For testing only, you can also choose the **hana-free** plan.

   ![entitlement hana](images/ent-hana.png)

   3. Search for **Cloud Foundry Runtime** and select the **MEMORY** plan.

   ![entitlement runtime](images/ent-runtime.png)

   4. Search for **Kyma Runtime** and select the respective plan.

   ![entitlement runtime](images/kyma-entitlements.png)

   5. Do the same for the following services:

      'SAP HANA Schemas & HDI container' ->Select Available Plans -> "hdi-shared"
      'Event Mesh' -> Select Available Service Plans -> "default"
      'Connectivity Service' -> Select Available Service Plans -> "proxy"
      'Launchpad Service' -> Select Available Service Plans -> "standard"

   7. Choose **Add 7 Service Plans**.

   8. Choose **Save**.

4. Enable the Cloud Foundry environment:

   ![enable CF](./images/cf1.png)

   1. In the **Plan** field, select **standard**.
   2. Choose **Create**.

   ![enable CF](./images/cf2.png)

4. Enable the Kyma environment:

   ![enable Kyma](./images/enable-kyma.png)

   1. In the **Plan** field, select **standard**.
   2. Choose **Create**.

6. Create a space in the Cloud Foundry environment.

   1. Go to the **Overview** section in SAP BTP cockpit, and add a space to the Cloud Foundry environment.

   ![create space](./images/create-space1.png)

   2. Fill in the **Space Name** field and assign the **Space Manager** and **Space Developer** roles to your user.

   ![create space](./images/create-space2.png)

7. To add additional users to the subaccount, choose **Security** &rarr; **Users** and choose **Create**.

   ![users](./images/user1.png)

8. In the **User Name** field, enter the user ID in the selected identity provider.

   ![users](./images/user2.png)

8. Assign the relevant subaccount roles to the users.

      1. Choose **Security** &rarr; **Role Collections**. Select one of the role collections below:

   ![role collection](./images/rolecollection1.png)

      2. Choose **Edit** and then add a user by setting the User ID. Selecting the relevant Identity Provider and set the user e-mail. Choose **Save**.

   ![role collection](./images/rolecollection1.png)

9.  Add users to the space.

   1. Select **Cloud Foundry** &rarr; **Space** and choose your space. Then, choose **Members**, add the emails of the team members, and assign the necessary roles to them.

   ![Space Members](images/space-members.png)

10. Enable Launchpad Subscription:
    
    1. In SAP BTP cockpit navigate to the **Services** &rarr; **Instances and Subscriptions** and choose **create**.

    ![lunchpad1](./images/launchpad1.png)

    2. In the **service** field choose **Launchpad Service**.
    3. In the **Plan** choose **standard**.
    4. Choose **Create**.

    ![lunchpad1](./images/launchpad2.png)

