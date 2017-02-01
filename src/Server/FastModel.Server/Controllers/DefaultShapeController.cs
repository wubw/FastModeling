using System.Web.Http;
using System.Web.Http.Cors;
using FastModel.Server.Models;
using Newtonsoft.Json;

namespace FastModel.Server.Controllers
{
    //[Authorize]
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class DefaultShapeController : ApiController
    {
        public string Get(string type)
        {
            var model = new Model();
            if (type == "plane")
            {
                var face = new Face();
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5 });
                face.Normal = new Vector() { X = 0, Y = 0, Z = 1.0 };
                model.Faces.Add(face);
            }
            if (type == "cube")
            {
                var face = new Face();
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5 });
                face.Normal = new Vector() { X = 0, Y = 0, Z = 1.0 };
                model.Faces.Add(face);

                face = new Face();
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = 0.5 });
                face.Normal = new Vector() { X = 0, Y = 0, Z = -1.0 };
                model.Faces.Add(face);

                face = new Face();
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = 0.5, });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = 0.5, });
                face.Normal = new Vector() { X = 1, Y = 0, Z = 0 };
                model.Faces.Add(face);

                face = new Face();
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5, });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5, });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = 0.5, });
                face.Normal = new Vector() { X = -1, Y = 0, Z = 0 };
                model.Faces.Add(face);

                face = new Face();
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = 0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = 0.5, Z = 0.5 });
                face.Normal = new Vector() { X = 0, Y = 1, Z = 0 };
                model.Faces.Add(face);

                face = new Face();
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = -0.5, Y = -0.5, Z = 0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = -0.5 });
                face.Vertices.Add(new Point() { X = 0.5, Y = -0.5, Z = 0.5 });
                face.Normal = new Vector() { X = 0, Y = -1, Z = 0 };
                model.Faces.Add(face);
            }

            return JsonConvert.SerializeObject(model);
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
