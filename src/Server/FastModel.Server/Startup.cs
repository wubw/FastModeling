using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(FastModel.Server.Startup))]

namespace FastModel.Server
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
