#Introduction
This the MOD civilian site, design for civilians that are entitled to benefits within the MOD.


#Getting Started
See the package.json for scripts, but you will need to install yarn 12.14.1 or later.
In the config.json file edit the variables to pull content down:

The files content should look like this:

``` {
  "env":{
    "secrets":{
      "CLIENT_ID":"#{environment.clientid}#",
      "CLIENT_SECRET":"#{environment.clientsecret}#"
    }
  }
}
```

*REPLACING TOKENS:

You must changed the client_id variable to to the buildstep found in Squidex.dev: https://mod-squidex-dev.cloudapps.digital/app/civilian-discover-my-benefits/settings/clients

So it looks something like:  `"CLIENT_ID":"the-build-step-variable:build-step",`
You must also do this for the CLIENT_SECRET.

These variables are environment specific so they need to change if you want to pull down uat and live content.

***DO NOT UNDER ANY CIRCUMSTANCES COMMIT THE ID OR SECRET AS YOU WILL BREAK THE BUILD PIPELINE!!!!!!!

1.	Run `Yarn dev` for develop content
2.	If you get an error like this:
``` ERROR

    Error in "/Users/USERNAME/Sites/MOD-Civilian/gatsby-node.js": Client secrets have not been replaced!
    Error: Client secrets have not been replaced!
```
Repeat the replace token step.

#Build and Test
TODO: Run `Yarn build` to build the solution

