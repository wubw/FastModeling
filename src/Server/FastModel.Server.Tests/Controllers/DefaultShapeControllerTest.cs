using System.Collections.Generic;
using FastModel.Server.Controllers;
using FastModel.Server.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace FastModel.Server.Tests.Controllers
{
    [TestClass]
    public class DefaultShapeControllerTest
    {
        [TestMethod]
        public void Get()
        {
            var controller = new DefaultShapeController();
            var response = controller.Get("sphere");
            var model = JsonConvert.DeserializeObject<Model>(response);
        }
    }
}
