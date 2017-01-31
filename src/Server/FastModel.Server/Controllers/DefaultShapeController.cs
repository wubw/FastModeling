using System.Collections.Generic;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using FastModel.Server.Models;
using Newtonsoft.Json;
using Swashbuckle.Swagger.Annotations;

namespace FastModel.Server.Controllers
{
    //[Authorize]
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class DefaultShapeController : ApiController
    {
        public string Get(string type)
        {
            if (type == "plane")
            {
                var face = new Face();
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });

                return JsonConvert.SerializeObject(face);
            }
            if (type == "cube")
            {
                var face = new Face();
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = 1.0 });

                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = 0.5, });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = 0.5, });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = 0.5, });
                face.Normals.Add(new Vector() { X = 1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = 1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = 1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = 1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = 1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = 1, Y = 0, Z = 0 });

                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5, });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = 0.5, });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5, });
                face.Normals.Add(new Vector() { X = -1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = -1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = -1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = -1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = -1, Y = 0, Z = 0 });
                face.Normals.Add(new Vector() { X = -1, Y = 0, Z = 0 });

                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = -1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = -1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = -1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = -1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = -1.0 });
                face.Normals.Add(new Vector() { X = 0, Y = 0, Z = -1.0 });

                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5 });
                face.Normals.Add(new Vector() { X = 0, Y = 1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = 1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = 1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = 1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = 1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = 1, Z = 0 });

                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = 0.5 });
                face.Normals.Add(new Vector() { X = 0, Y = -1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = -1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = -1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = -1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = -1, Z = 0 });
                face.Normals.Add(new Vector() { X = 0, Y = -1, Z = 0 });

                return JsonConvert.SerializeObject(face);
            }

            return string.Empty;
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
