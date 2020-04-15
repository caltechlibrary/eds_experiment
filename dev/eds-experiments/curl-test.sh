#!/bin/bash -x

curl --header "Content-Type: application/json" --request POST \
     --data '{ "UserId": "", "Password": "" }' \
     --trace-ascii - \
     https://eds-api.ebscohost.com/authservice/rest/uidauth

# curl -H "Origin: http://localhost" \
#      -H "Access-Control-Request-Method: POST" \
#      -H "Access-Control-Request-Headers: X-Requested-With" \
#      -X POST \
#      --trace-ascii - \
#      https://eds-api.ebscohost.com/authservice/rest/uidauth
