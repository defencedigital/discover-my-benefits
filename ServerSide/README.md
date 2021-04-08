#Introduction 
This project is the Web API to power the Discover My Benefits application.
Built using .NET Core 3.1, it is acting as a middleware between the app and other services, currently only for feedback requests.

#Getting Started
Ensure .NET Core 3.1 and Visual Studio 2019 are installed
Check out the repository into - C:\working_git\MOD\MOD-Rewards-Hub-API\
Create an IIS Website:
- Name = MOD-API
- Path = C:\working_git\MOD\MOD-Rewards-Hub-API\www
- Binding = Type: https, Host name: modapi.localhost, SSL certificate: IIS Express Development Certificate
- Application Pool .NET CLR version = No managed code

#Build
Compile the solution and Publish the MODBenefitsCalculator.API project using "Publish API to WWW" profile.

#Swagger documentation
Browse to https://modapi.localhost/index.html to browse the API documentation.
