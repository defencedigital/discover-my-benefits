const axios = require('axios');
curl
    -X POST 'https://mod-squidex-dev.cloudapps.digital/identity-server/connect/token'
    -H 'Content-Type: application/x-www-form-urlencoded'
    -d 'grant_type=client_credentials&
        client_id=modbenefitscalculatordev:build-step&
        client_secret=qIxscx2Jrd8Q1ECG5ARQMgOwUpsYjemqYQx8wSx478U=&
        scope=squidex-api'

curl
    -X POST 'https://mod-squidex-uat.cloudapps.digital/identity-server/connect/token'
    -H 'Content-Type: application/x-www-form-urlencoded'
    -d 'grant_type=client_credentials&
        client_id=modbenefitscalculatordev:build-step&
        client_secret=qIxscx2Jrd8Q1ECG5ARQMgOwUpsYjemqYQx8wSx478U=&
        scope=squidex-api'