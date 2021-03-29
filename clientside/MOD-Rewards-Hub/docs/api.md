## API Documentation

The swagger documentation is found here: https://mod-benefits-api-uat.cloudapps.digital/index.html

The API is used to provide a backend for certain features. Initially, this provides a way of submitting feedback for the DMB website. The feedback is sent through this API and then pushed into ZoHo Analytics.

Currently all API methods are accessed without authentication. The methods are given below with the expected JSON variables. It is important to note that there are multiple types of response for errors. The status code should be used primarily to determine if the request has been successful. If a 400 Bad Request is received then there can be multiple formats to the JSON response depending on which part of the API experienced an error. There is one format for low level validation errors and another for application managed errors. Examples of both are given below. The information in error responses does not need to be presented to the user, it is there for informational purposes.