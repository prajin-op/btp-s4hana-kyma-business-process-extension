## Test Entire Business Scenario End-To-End
1. Start your Business Partner Validation Application

- Go to *Instances and Subscriptions.*
- Find *Launchpad Service* and click to open the application
- In the Website, Manager find your created Website and click on tile to open
- Click on Business Partner Validation tile
- The list of BusinessPartners along with their verification status gets displayed.

 ![App](./images/endtoend2.png)

2. Log in to your SAP S/4HANA On-prem System

 ![Backend](./images/endtoend3.png)

3. Enter transaction code *bp*

 ![Backend](./images/endtoend4.png)

4. Create a new Business Partner

- Click on Person

 ![Backend](./images/endtoend5.png)

- Provide first name and last name for the business partner

 ![Backend](./images/endtoend6.png)

- Provide the address

 ![Backend](./images/endtoend7.png)

 - Move to the status tab and check mark the 'Central Block' lock. Save the BP. It creates a new Business Partner.

 ![Backend](./images/endtoend8.png)

1. Now, go back to the BusinessPartnerValidation application to see if the new BusinessPartner has appeared as a new entry in the UI.

 ![App](./images/endtoend9.png)

6. Go to the details page for the new BusinessPartner
7. Click on Edit and set the Status to *Verified*

 ![Backend](./images/endtoend10.png)

8. (Optional) You can configure Event Mesh in a way so that you can see the created Event. For that you could create an additional queue that subscribes to the topic as well.

 ![Backend](./images/endtoend11.png)

9. Go to your SAP S/4HANA on-premise System.
10. Go to transaction *bp*

 ![Backend](./images/endtoend4.png)

11. Open the details of the Business Partner you have set to *Verified.*

 ![Backend](./images/endtoend12.png)

12. Go to the Status tab. You can see that the central Block lock has been removed.

 ![Backend](./images/endtoend13.png)
