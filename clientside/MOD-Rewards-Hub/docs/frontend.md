## Requirements
This project uses node version 10.0.0.
Make sure you have node-sass installed


## Quick start (development)
If you are using nvm make sure you switch to v10.0.0 before running this project.

To run in development mode (localhost:3000):

`npm install`
`npm run start`

To watch the SASS, in a separate terminal, run:

`npm run sass`

The watch sass command is only needed for local development, as the css gets built as part of the pipeline, so do not commit css files only scss files.



## Issues during local dev set-up

`npm install` results in the below error on `local`.

```

> mod-benefits-calculator@3.5.0 build:dll /Users/jatin.nanda/code/MOD-Rewards-Hub
> node ./internals/scripts/dependencies.js

Building the Webpack DLL...
path.js:28
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'path', 'string');
    ^

TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string
    at assertPath (path.js:28:11)
    at Object.resolve (path.js:1184:7)
    at module.exports (/Users/jatin.nanda/code/MOD-Rewards-Hub/internals/webpack/webpack.base.babel.js:20:16)
    at Object.<anonymous> (/Users/jatin.nanda/code/MOD-Rewards-Hub/internals/webpack/webpack.dll.babel.js:22:18)
    at Module._compile (module.js:641:30)
    at loader (/Users/jatin.nanda/code/MOD-Rewards-Hub/node_modules/babel-register/lib/node.js:144:5)
    at Object.require.extensions.(anonymous function) [as .js] (/Users/jatin.nanda/code/MOD-Rewards-Hub/node_modules/babel-register/lib/node.js:154:7)
    at Module.load (module.js:560:32)
    at tryModuleLoad (module.js:503:12)
    at Function.Module._load (module.js:495:3)
added 1827 packages in 36.297s

```

This occurs as environment variables are not set for `npm run build:dll`. This does not happen on the build pipeline. To resolve for local just execute: `npm run build:dll:dev`

Once the completed we need to sync content to our local machine using: `npm run squidex:sync`

## Sync content

To pull down the latest data from Squidex run:

`npm run squidex:sync:dev` for dev content
`npm run squidex:sync:uat` for uat content
`npm run squidex:sync:prod` for prod content

Squidex urls are:
`https://mod-squidex-dev.cloudapps.digital/`
`https://mod-squidex-uat.cloudapps.digital/`
`https://mod-squidex-prod.cloudapps.digital/`

Ben Richardson is currently the only admin that can add users so speak to him to add you.



## Generating a new Squidex token

If this is your first time setting up MOD you need to generate tokens inorder to pull down the content from Squidex.

You will need to install Postman if you haven't already, with the following setup:

DEV SETUP:

Set up a POST request with the url: https://mod-squidex-dev.cloudapps.digital/identity-server/connect/token

Click the body tab in the request and set up the following:

``` grant_type:client_credentials
client_id:civilian-discover-my-benefits:build-step
client_secret:2gzawx73xlchy7emnsptso7nrhpaemy81cwzlpsexvmx
scope:squidex-api ```

Make sure the content-Type x-www-form-urlencoded has been checked.


UAT SETUP:

Set up a POST request with the url: https://mod-squidex-uat.cloudapps.digital/identity-server/connect/token

Click the body tab in the request and set up the following:

``` grant_type:client_credentials
client_id:modbenefitscalculatoruat:build-step
client_secret:qIxscx2Jrd8Q1ECG5ARQMgOwUpsYjemqYQx8wSx478U=
scope:squidex-api ```

Make sure the content-Type x-www-form-urlencoded has been checked.


PROD SETUP:

Set up a POST request with the url: https://mod-squidex-prod.cloudapps.digital/identity-server/connect/token

Click the body tab in the request and set up the following:

``` grant_type:client_credentials
client_id:modbenefitscalculatorprod:build-step
client_secret:qIxscx2Jrd8Q1ECG5ARQMgOwUpsYjemqYQx8wSx478U=
scope:squidex-api ```

Make sure the content-Type x-www-form-urlencoded has been checked.



`sync` has on three environment variables passed to it: `SERVICE`, `SQUIDEX_URI` and `SQUIDEX_TOKEN`. The latter two are dependent on environment. `SERVICE` is not used in `sync.js` at all. However, it is used in one of the files `required` by `syncjs` - `base64`.

In `base64` `SERVICE` is used as part of the path for assets.

### Issue with the initial sync

It appears that when setting up for local development, and or running `npm run squidex:sync` for the first time [in while too] the sync process fails. Re-run the cmd and the process completes successfully.

One issue could be due to token expiry. To resolve correct the `squidex` token in `package.json`

## Production start

`npm run squidex:sync:prod && npm run build && npm start:prod`
(sync with Squidex, build project, start server in production mode)

OR

`NODE_ENV=production npm run squidex:sync:prod && npm run test && npm run build && node server.js`

(sync with Squidex, run tests, build project, start server)


## Testing

This project has been using Snapshot testing and Unit tests

To run tests:

`npm run test`

To run and watch for changes:

`npm run test:watch`


## i18n.js

This project (currently) uses language codes to represent service types (army, navy).
This is so you can use the react-intl to switch between Army and Navy the same as you would a language.



## config.js (app/config.js)

For each environment you will need a Squidex URL and an Authorization Token.
Below is an example:

```jsx
module.exports = {
  services: ['army', 'navy'],
  squidex: {
    uri: 'https://cloud.squidex.io/api/content/modbenefitscalculatoruat/graphql',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer X',
    },
  },
};
```


## Adding a new service theme

* Create new service.json in /translations
* Add new service to config.js
* Add new service.js file to components/Page/styles
* Add new service scss files to /sass you must have the service.scss file with its own service-variables.scss file.

## Adding a new value/field from squidex

* Add property to Squidex GraphQL query in /internals/scripts/squidex/queries
* Add property to sync.js file (/internals/scripts/squidex/sync.js)
* Add property to PropType in corresponding container > propTypes.js

## Patterns
* `http://localhost:3000/patterns`


## SubApps

SubApps is the name given to sections of the application that do not follow the service/category/benefit page flow.
These are custom page(s) that can be linked to from category pages such as FS and FAM (more info below).

## FS SubApp

FS stands for Flexible service.

This is how a serving personnel can see changes in xFactor, Leave and Salary if they changed to another commitment type, for example from Full-Time to Part-Time.

First take a look at the fs-commitment-type schema in Squidex. The field labels should help give you an idea of what's going on.

* Some Commitment Types calculate salary using a custom calculation for OF5 and above. These calculations are made up of percentages and other Commitment Type values (see fs-calculation schema).
* Each Commitment Type has a reduction percentage for example Full-Time: 0% and Full-Time 40% reduction: 40%.
* Each Commitment Type has a xFactor percentage (extra £ added to their salary based on how dangerous their Commitment Type is).
* Each Commitment Type in linked to a benefit (so you can click link/title in table for more information)
* Some Commitment Types have a variable amount of days worked (entered by the user)
* xFactor is not shown for OF5 and Above and a message is shown (message text is added in the CMS)
* Leave is calculated by taking maximum days of Full-Time (38 days). Take into account the reduction % for example (40% commitment). Then apply that to the 38. Then multiple it by the Leave Days figure added to each Commitment Type in the CMS. In the case of days you need to work out the Commitment Type % based on the days entered then apply the same calculation.
* There are mobile and desktop tables.

The values in flexible service are pulled into the pay eligibility questions (annual salary page), so if you have to add a new serving type don't forget to add it in the fs-commitment-type content in squidex as it depends on the above values being present so the pay questions will show!

## FAM & TP

Data for TP and FAM is stored in JSON files in `app/json/fam` and `app/json/tp`.

Main components are:

* TP Allowance/FAM Allowance
* FAM Deposit Advance
* FAM Rental Advance

FAM Deposit Advance and FAM Rental Advance are simple calculations (see the component).

See `onBottomFormUpdate` in containers/FAM/Allowance for the main Allowance calculation (used by TP and FAM Allowance).

## Sitemap

See `internals/scripts/sitemap`. Used by `sever.js` to send correct status codes.

## offline-first

See `internals/webpack/webpack.prod.babel.js` OfflinePlugin settings for the offline stuff. You can see in the `additional` the sitemap is used add all the URL's of the site to the service workers.

* Services Workers are only used in production mode.
* Services Workers are disabled in IE.
* Services Workers events are managed in `app/app.js`, currently starts line 124.


## Local Storage

* Profile data (filled out questions), favourites, and updates are stored in `localstorage`.
* Profile data is per service.


## Pay

Every 6 or 12 months we need to update the rate of pay for serving personnel within the military.

We have 3 files which have the following pieces of information:

Payment tables, Pay Ranges and Ranks.

All of which is tallied together using documentation from the MOD to put together the Pay.json file.

For example:

```
 {
    "ID": 1,
    "PayTableID": 1,
    "PayRangeID": 1,
    "Level": "Level 6",
    "Salary": 194630.28,
    "Salary2018": 194630.28,
    "Salary2019": 202493.28,
    "Salary2020": 206543.16
  },

```

The above is an example of a senior officers level 6 pay level, we can validate this by referencing the payTables.json, payRange.json.

We have added in all the levels manually into the pay.json file using a document sent to us by the MOD.

Sometimes you may have to enter a new paytable which doesn't exsit.

Steps to do this are as follows:

Find out if the new pay table is a unique pay table.

Add the new table object in payTable.json like so:

```

{
  "ID": XX,
  "TableName": "XXX XXX XXX",
  "IsUniquePayTable": 0 or -1 (depending on the first step)
}

```
The add the required levels into the pay.json file manually (if they don't exist already - seriously check this!).

If its a unique pay table it will be shown as an option automatically within the drop downs of the pay benefit.

If you are updating salaries add in the salary year underneath most recent and then go to `app/modules/Pay` and replace all instances of:

  r.Salary2020,

to the latest year.

(If you are adding a new serving type please see the FS section above!)

Its important to know that this tool's data is also used by:

https://www.royalnavy.mod.uk/my-navy/the-offer
https://www.royalnavy.mod.uk/raf/benefits-calculator
https://www.royalnavy.mod.uk/british-army/benefits-calculator

so if we have any updates in any of the pay files then those pages will also need to be updated too using a mapping tool that is known to the navy team. (speak to andy landsdowne)

* Pay data is pulled from `app/json/pay`


## Trouble Shooting

Getting the following error: `Error: Request failed with status code 401`
means the bearer token you are using for that environment is incorrect (this is found in the package.json)
Go back to : Generating a new Squidex token near the top of this document to fix.

Getting the following error: `Query thing of undefined` means the schema/s item/s you are querying are missing in squidex.
Check that the item has content or that the item does indeed exist in the relvevant squidex environment.

