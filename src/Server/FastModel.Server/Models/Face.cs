using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FastModel.Server.Models
{
    public class Point
    {
        public double X { get; set; }
        public double Y { get; set; } 
        public double Z { get; set; }
    }

    public class Face
    {
        public Face()
        {
            Vertices = new List<Point>();
        }

        public IList<Point> Vertices { get; private set; }    
    }
}