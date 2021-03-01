# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide

# Register S4 System

Create a system in SAP BTP Cockpit.
Copy the generated token.
Create a new Extension in SAP Marketing Cloud under Maintain SAP Cloud Platform Extensions and provide the copied token.

In SAP BTP, add entitlements for SAP S/4HANA Cloud Extensibility to the subaccount in which SAP BTP, Kyma runtime is enabled.

Choose Add Service Plans.
Select SAP S/4HANA Cloud Extensibility.
Select the registered S/4 system from the drop-down menu.
Select both messaging and api-access plans.
Save the changes

# Enable calling SAP S4HANA Cloud APIs
In SAP BTP, Kyma runtime, access SAP S/4HANA Cloud Extensibility in Service Catalog.
Create a new instance with the api-access plan.
In the background, this will:

Set up all the necessary communication arrangements in SAP Marketing Cloud.
Create the necessary system users to make API calls.
Set up any other configuration required to make API calls.

## Next Steps

- Open a new terminal and run `cds watch` 
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
