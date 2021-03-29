#!/bin/bash
# Generate new token and store in a txt file
wget $SQUIDEX_TOKENURL --post-data "grant_type=client_credentials&client_id=${SQUIDEX_CLIENTID}&client_secret=${SQUIDEX_CLIENTSECRET}&scope=squidex-api"

# extract only the token and save the output
jq -r '.access_token' token > tokenformatted

# Update Variable in TFS
input="tokenformatted"
value=$(<$input)
echo "##vso[task.setvariable variable=Squidex.Token]Bearer $value"