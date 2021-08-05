namespace Vue3Net6Authentication.Data
{
    public class ApplicationDbContext : MongoIdentityDbContext<ApplicationUser, MongoIdentityRole>
    {
        public ApplicationDbContext(IMongoDbConnection connection) : base(connection) { }
    }

}
