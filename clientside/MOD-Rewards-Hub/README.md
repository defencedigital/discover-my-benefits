# Welcome to the Benefits Calculator

For the Frontend Documentation see [here](docs/frontend.md)
For the cms Documentation see [here](docs/cms.md)
For the API Documentation see [here](docs/api.md)

## Environments
* Dev: https://mod-benefits-calculator-dev.cloudapps.digital/
* UAT: https://mod-benefits-calculator-uat.cloudapps.digital/

## Squidex Urls
* Dev: https://mod-squidex-dev.cloudapps.digital/
* UAT: https://mod-squidex-uat.cloudapps.digital/

## API Urls
* Dev/UAT: https://mod-benefits-api-uat.cloudapps.digital/

## ZoHo Analytics
* Dev/UAT: subscriptions@greatstate.co - https://accounts.zoho.eu/signin?servicename=ZohoReports

# MOD - Discover my benefits

**Purpose**

The Discover my benefits web application is designed to allow serving personnel and members of the public to find out about the various benefits that might be available to them.

**Tech summary**

The front-end of the platform is a series of single-page applications, built on [React.js](https://reactjs.org/). They are glued together by routing such that subfolders (e.g. /navy, /raf) route to individual single page applications dedicated to a particular service (e.g. Navy), running in separate instances. The homepage itself, which links to individual services, is a static webpage.

The SPAs themselves are progressive web apps, enabling offline storage and functionality for repeat visits in the event of (for example) a mobile signal dropout.

The back-end of the platform, such as it is, is an open-source content management system called [Squidex](https://squidex.io/).

There is no &#39;live&#39; link between the front-end applications and Squidex CMS – content is pulled from Squidex at application  **build ** time, and statically compiled into the front-end applications as part of the [NPM](https://www.npmjs.com/) build for those applications.

**Front-end tools summary**

[**React.js**](https://reactjs.org/)

A modular, open-source Javascript framework for building user interfaces. It is component based. We chose React because it makes it very easy to build responsive user interfaces in reusable components, reducing development effort and complexity.

[**Node.js**](https://nodejs.org/en/)

Node.js is used to serve the static files that comprise the web application. We use Node as it&#39;s open-source and very fast to serve files. Given the website is entirely based on static files, it&#39;s very performant and easy to scale when required.

[**NPM**](https://www.npmjs.com/)

NPM is an open source Javascript-based package manager. We chose NPM as it&#39;s Javascript-based – in line with our existing front-end tools and skillset – and because it hosts a number of packages essentials to ensuring code quality, such as linters and test runners. We also use an NPM package to pull content from Squidex CMS and statically compile it into the single-page applications described above.

**Back-end tools summary**

[**Squidex**](https://squidex.io/)

An open-source headless content management system built with [.NET Core](https://github.com/dotnet/core). We chose Squidex as it is open-source software built on top of an open-source framework (.NET Core), and they are both tools that are in line with existing back end skillsets.

[**TFS**](https://docs.microsoft.com/en-us/azure/devops/server/tfs-is-now-azure-devops-server?view=azure-devops)

We use TFS for storing and tracking code (Git), tracking work items, and managing builds and releases. It is a pre-existing existing provided by the MOD. It was chosen as it already exists and is secure.

[**MongoDB Atlas**](https://www.mongodb.com/cloud/atlas)

We use MongoDB Atlas as the data store for Squidex. It is a non-relational, cloud-hosted database platform that enables [easy scaling](https://www.mongodb.com/cloud/atlas/performance), [automated backups](https://www.mongodb.com/cloud/atlas/reliability), and [enterprise level security](https://www.mongodb.com/cloud/atlas/security). There was no option to host MongoDB within the hosting platform used by the rest of the system, and therefore MongoDB Atlas was chosen as it reduces operational complexity by effectively being a managed service.

**Infrastructure summary**

[**GovPaas**](https://www.cloud.service.gov.uk/)

The majority of the system is hosted on GovPaaS – a government hosting service provided by GDS. It is secure, scalable and supports a wide range of languages and services, backed by enterprise-level support and SLAs. There is [extensive security documentation available](https://www.cloud.service.gov.uk/security). Behind the scenes, GovPaas runs on AWS and we interact with it using the CloudFoundry API.

[**ZoHo Analytics**](https://www.zoho.com/analytics/)

There is an API used to connect to it. It is accessed by the DMB API. Refresh tokens are used to update the access token on each request if it has been longer than the expiry (currently 60 mins).

**Infrastructure overview**



**Security**

**Front-end**

The website front-end does not integrate with any third-party systems. It does not transmit user data. Information entered into the tool by users is only stored on the client device and is not transmitted or stored by back-end servers. The only back-end server technology in use by the front-end is Express.js – responsible only for serving up the static files that the website is comprised of.

Information that is entered into the website by users can be explicitly cleared by them with a clearly signposted button at the top of every page.

**Squidex**

Squidex is protected by basic authentication – no 2FA. Only authorised users have credentials to access the Squidex UI. The datastore is encrypted in MongoDB Atlas.

**TFS**

TFS is protected by basic authentication, with accounts automatically disabled after 40 days irrespective of level of usage.

Within TFS, there is role-based access control to ensure users can only access information and perform actions that are authorised for their role.

For example, only the &#39;developer&#39; role has access to code &amp; build and release pipelines. Other roles are able to create and edit work items but will not be see the code or the pipelines.

**MongoDB Atlas**

MongoDB Atlas is using multi factor authentication. The data is encrypted as per their [documentation](https://www.mongodb.com/cloud/atlas/faq). Role-based authentication is used for logging into the MongoDB Atlas control panel to restrict access to production environment to only those people who require it to do their job.

**GovPaas**

Access to GovPaas is not protected by 2FA. Access is restricted to essential staff only. Within that there is RBAC to restrict production access to only essential staff.

**Branching Strategy**

There are two main branches, master and develop. The live deployment pipeline deploys from the master branch and therefore nothing should be merged into the master branch unless it is production ready.

Develop is deployed to the Dev and UAT environments. When starting a new feature, you should create a new feature branch from develop. When the feature is ready for testing, a PR can be created to pull it into develop. Note: once work is in develop, it is committed to go live next (with exception of hotfixes). If you believe the work may block other work you must deploy the feature branch to the environment (this will require modification of the pipeline).

Once the develop branch has been tested and approved, a PR from develop into master can be created.

Hotfixes - if there is non-deployed work in the develop branch then you should avoid the normal process and instead branch from master. You should deploy the feature branch to Dev/UAT and once tested PR from the feature branch into master. You must also PR master back into the develop branch to update it with the fix. You may also need to do the same to any active feature branches (or rebase).

**Deployments (DMB app)**

The DMB app consists of just a release step in TFS. There is a release per environment:

- 01 MOD Dev Pipeline - Develop Branch
- 02 MOD UAT Pipeline - Develop Branch
- 03 MOD Prod Pipeline - Master Branch

Each release has to be created manually and the relevant GIT revision must be chosen for the Homepage and Main repositories.
Each release has a stage for each part of the application (Homepage, Navy, Marines, Army, RAF).

The release process works as follows:

- **--** The code is built for each individual web application (e.g. Navy, RAF, Army) using TFS, an automated process
  - **oo** This involves installing necessary NPM packages and running the associated scripts
  - **oo** One of these NPM packages calls the Squidex API to fetch the data from Squidex, which is compiled into the web application

- **--** Once the code has been built, the web application is pushed to [Cloud Foundry](https://docs.cloud.service.gov.uk/) – the system that powers GovPaas. We specify a &#39;manifest&#39; file that dictates the amount of memory, number of instances, and &#39;buildpack&#39; required (which in this case is Node.js, the platform that Express.js runs on)

Deployments are carried out using a preview feature for blue/green deployments.

**Resilience**

- Production is running two instances of each app.
- The database is backed up automatically by MongoDB Atlas every day.
- Infrastructure can be spun up rapidly as it&#39;s deployed via code (except TFS)
- All code (including infrastructure) is version controlled

There is currently no regular schedule of testing restoration of backups etc.

**This is an area of technical debt that should be considered alongside the business case for it in terms of additional costs.**

## GovPaaS

GOV.UK Platform as a Service (PaaS) is a cloud-hosting platform built by the Government Digital Service (GDS). GOV.UK PaaS uses the open source [Cloud Foundry](https://www.cloudfoundry.org/) project, and runs on Amazon Web Services. GOV.UK PaaS manages the deployment of applications and services. The GOV.UK PaaS is hosted in two regions, London and Ireland. The organisation account for this client is hosted in Ireland as UK was not available when it was created.


## How to log into GovPaaS

* To login: [https://login.cloud.service.gov.uk/login](https://login.cloud.service.gov.uk/login)
* To login using CLI: `cf login -a api.cloud.service.gov.uk -u your-email-address-greatstate.co`


##How an application is deployed to GovPass

[Doc link](https://docs.cloud.service.gov.uk/deploying_apps.html#deploying-apps)


###DNS & SSL setup

[Doc link](https://docs.cloud.service.gov.uk/deploying_services/use_a_custom_domain/). Additional info: [DNS for Domains](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#domains) External cloud foundry link.
