using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using MODBenefitsCalculator.API.Models.ZoHo;
using System;
using System.IO;
using System.Reflection;
using Mindscape.Raygun4Net.AspNetCore;

namespace MODBenefitsCalculator.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                                  builder =>
                                  {
                                      builder.WithOrigins("https://discovermybenefits.mod.gov.uk")
                                             .WithHeaders("Content-Type", 
                                                          "Origin",
                                                          "Accept",
                                                          "X-Requested-With")
                                             .WithMethods("GET", "POST", "PUT", "OPTIONS");
                                  });
            });

            services.AddControllers();
            services.AddMemoryCache();

            services.AddSingleton(x => new ZoHoOptions
            {
                AccountEmailAddress = Configuration.GetValue<string>("ZoHo:AccountEmail"),
                ClientId = Configuration.GetValue<string>("ZoHo:ClientId"),
                ClientSecret = Configuration.GetValue<string>("ZoHo:ClientSecret"),
                DataAPIUrl = Configuration.GetValue<string>("ZoHo:DataAPIUrl"),
                WorkspaceName = Configuration.GetValue<string>("ZoHo:MODWorkspaceName"),
                RefreshToken = Configuration.GetValue<string>("ZoHo:RefreshToken")
            });

            services.AddSingleton<Services.ZoHoService>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "MOD Benefits API", Version = "v1" });
                c.CustomSchemaIds(x => x.FullName);

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            services.AddRaygun(Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment() || env.IsEnvironment("UAT"))
            {
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MOD Benefits API v1");
                    c.RoutePrefix = string.Empty;
                });

                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRaygun();

            app.UseRouting();

            app.UseCors();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
