using System;
using System.Collections.Generic;
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
                GetPlaneModel(model);
            }
            if (type == "cube")
            {
                GetCubeModel(model);
            }
            if (type == "sphere")
            {
                GetShpereModel(model);
            }

            return JsonConvert.SerializeObject(model);
        }

        private static void GetShpereModel(Model model)
        {
            var latitudeBands = 30;
            var longitudeBands = 30;
            var radius = 0.5;
            var normalData = new List<Vector>();
            var vertexPositionData = new List<Point>();

            for (var latNumber = 0; latNumber <= latitudeBands; latNumber++)
            {
                var theta = latNumber*Math.PI/latitudeBands;
                var sinTheta = Math.Sin(theta);
                var cosTheta = Math.Cos(theta);
                for (var longNumber = 0; longNumber <= longitudeBands; longNumber++)
                {
                    var phi = longNumber*2*Math.PI/longitudeBands;
                    var sinPhi = Math.Sin(phi);
                    var cosPhi = Math.Cos(phi);
                    var x = cosPhi*sinTheta;
                    var y = cosTheta;
                    var z = sinPhi*sinTheta;
                    //var u = 1 - (longNumber / longitudeBands);
                    //var v = latNumber / latitudeBands;
                    normalData.Add(new Vector {X = x, Y = y, Z = z});
                    vertexPositionData.Add(new Point {X = radius*x, Y = radius*y, Z = radius*z});
                }
            }

            for (var latNumber = 0; latNumber < latitudeBands; latNumber++)
            {
                for (var longNumber = 0; longNumber < longitudeBands; longNumber++)
                {
                    var first = (latNumber*(longitudeBands + 1)) + longNumber;
                    var second = first + longitudeBands + 1;

                    var face1 = new Face();
                    face1.Vertices.Add(vertexPositionData[first]);
                    face1.Vertices.Add(vertexPositionData[second]);
                    face1.Vertices.Add(vertexPositionData[first+1]);
                    face1.Normal = normalData[first];
                    model.Faces.Add(face1);

                    var face2 = new Face();
                    face2.Vertices.Add(vertexPositionData[second]);
                    face2.Vertices.Add(vertexPositionData[second+1]);
                    face2.Vertices.Add(vertexPositionData[first+1]);
                    face2.Normal = normalData[second];
                    model.Faces.Add(face2);
                }
            }
        }

        private static void GetCubeModel(Model model)
        {
            var face = new Face();
            face.Vertices.Add(new Point {X = -0.5, Y = -0.5, Z = -0.5});
            face.Vertices.Add(new Point {X = -0.5, Y = 0.5, Z = -0.5});
            face.Vertices.Add(new Point {X = 0.5, Y = -0.5, Z = -0.5});
            face.Normal = new Vector {X = 0, Y = 0, Z = 1.0};
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point { X = -0.5, Y = 0.5, Z = -0.5 });
            face.Vertices.Add(new Point { X = 0.5, Y = -0.5, Z = -0.5 });
            face.Vertices.Add(new Point { X = 0.5, Y = 0.5, Z = -0.5 });
            face.Normal = new Vector { X = 0, Y = 0, Z = 1.0 };
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point {X = -0.5, Y = -0.5, Z = 0.5});
            face.Vertices.Add(new Point {X = -0.5, Y = 0.5, Z = 0.5});
            face.Vertices.Add(new Point {X = 0.5, Y = -0.5, Z = 0.5});
            face.Normal = new Vector {X = 0, Y = 0, Z = -1.0};
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point { X = -0.5, Y = 0.5, Z = 0.5 });
            face.Vertices.Add(new Point { X = 0.5, Y = -0.5, Z = 0.5 });
            face.Vertices.Add(new Point { X = 0.5, Y = 0.5, Z = 0.5 });
            face.Normal = new Vector { X = 0, Y = 0, Z = -1.0 };
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point {X = 0.5, Y = 0.5, Z = -0.5,});
            face.Vertices.Add(new Point {X = 0.5, Y = 0.5, Z = 0.5,});
            face.Vertices.Add(new Point {X = 0.5, Y = -0.5, Z = -0.5,});
            face.Normal = new Vector {X = 1, Y = 0, Z = 0};
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point { X = 0.5, Y = 0.5, Z = 0.5, });
            face.Vertices.Add(new Point { X = 0.5, Y = -0.5, Z = -0.5, });
            face.Vertices.Add(new Point { X = 0.5, Y = -0.5, Z = 0.5, });
            face.Normal = new Vector { X = 1, Y = 0, Z = 0 };
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point {X = -0.5, Y = 0.5, Z = -0.5,});
            face.Vertices.Add(new Point {X = -0.5, Y = 0.5, Z = 0.5,});
            face.Vertices.Add(new Point {X = -0.5, Y = -0.5, Z = -0.5,});
            face.Normal = new Vector {X = -1, Y = 0, Z = 0};
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point { X = -0.5, Y = 0.5, Z = 0.5, });
            face.Vertices.Add(new Point { X = -0.5, Y = -0.5, Z = -0.5, });
            face.Vertices.Add(new Point { X = -0.5, Y = -0.5, Z = 0.5, });
            face.Normal = new Vector { X = -1, Y = 0, Z = 0 };
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point {X = -0.5, Y = 0.5, Z = -0.5});
            face.Vertices.Add(new Point {X = -0.5, Y = 0.5, Z = 0.5});
            face.Vertices.Add(new Point {X = 0.5, Y = 0.5, Z = -0.5});
            face.Normal = new Vector {X = 0, Y = 1, Z = 0};
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point { X = -0.5, Y = 0.5, Z = 0.5 });
            face.Vertices.Add(new Point { X = 0.5, Y = 0.5, Z = -0.5 });
            face.Vertices.Add(new Point { X = 0.5, Y = 0.5, Z = 0.5 });
            face.Normal = new Vector { X = 0, Y = 1, Z = 0 };
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point {X = -0.5, Y = -0.5, Z = -0.5});
            face.Vertices.Add(new Point {X = -0.5, Y = -0.5, Z = 0.5});
            face.Vertices.Add(new Point {X = 0.5, Y = -0.5, Z = -0.5});
            face.Normal = new Vector {X = 0, Y = -1, Z = 0};
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point { X = -0.5, Y = -0.5, Z = 0.5 });
            face.Vertices.Add(new Point { X = 0.5, Y = -0.5, Z = -0.5 });
            face.Vertices.Add(new Point { X = 0.5, Y = -0.5, Z = 0.5 });
            face.Normal = new Vector { X = 0, Y = -1, Z = 0 };
            model.Faces.Add(face);
        }

        private static void GetPlaneModel(Model model)
        {
            const double z = 0d;
            var face = new Face();
            face.Vertices.Add(new Point {X = -0.5, Y = -0.5, Z = z });
            face.Vertices.Add(new Point {X = -0.5, Y = 0.5, Z = z });
            face.Vertices.Add(new Point {X = 0.5, Y = -0.5, Z = z });
            face.Normal = new Vector {X = 0, Y = 0, Z = 1.0};
            model.Faces.Add(face);

            face = new Face();
            face.Vertices.Add(new Point { X = -0.5, Y = 0.5, Z = z });
            face.Vertices.Add(new Point { X = 0.5, Y = -0.5, Z = z });
            face.Vertices.Add(new Point { X = 0.5, Y = 0.5, Z = z });
            face.Normal = new Vector { X = 0, Y = 0, Z = 1.0 };
            model.Faces.Add(face);
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
