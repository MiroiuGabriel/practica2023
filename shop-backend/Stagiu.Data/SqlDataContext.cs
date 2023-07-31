using Microsoft.Data.SqlClient;
using Stagiu.Business.Contracts;
namespace Stagiu.Data
{
    public class SqlDataContext : IDisposable
    {
        public SqlConnection Connection { get; }
        public SqlDataContext(IConnectionString connectionString)
        {
            Connection = new SqlConnection(connectionString.SqlConnectionString);
        }
        public void Dispose()
        {
            if (Connection is null)
            {
                return;
            }

            Connection.Close();
            Connection.Dispose();
        }
    }
}
