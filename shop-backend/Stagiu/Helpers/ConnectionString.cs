using Stagiu.Business.Contracts;

namespace Stagiu.Helpers
{
    public class ConnectionString : IConnectionString
    {
        public ConnectionString(string connectionString)
        {
            SqlConnectionString = connectionString;
        }

        public string SqlConnectionString { get; private set; }
    }
}
