using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Options;

namespace YZ.UsersManagement.Infrastructure.Data;

internal class ApplicationDbContextDesignTimeFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // TODO: pass connection string using args or using configuration
        var connectionString = "Server=.\\SQLEXPRESS;Database=YZ.UsersManagement;Integrated Security=True;TrustServerCertificate=True;";
        Console.WriteLine($"connectionString = '{connectionString}'");

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        IOptions<OperationalStoreOptions> operationalStoreOptions = Options.Create(new OperationalStoreOptions());

        return new ApplicationDbContext(optionsBuilder.Options, operationalStoreOptions);
    }
}