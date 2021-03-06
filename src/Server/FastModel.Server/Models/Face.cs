﻿using System;
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

    public class Vector : Point { }

    public class Face
    {
        public Face()
        {
            this.Vertices = new List<Point>();
        }

        public IList<Point> Vertices { get; private set; }    
        public Vector Normal { get; set; }
    }

    public class Model
    {
        public Model()
        {
            this.Faces = new List<Face>();
        }

        public IList<Face> Faces { get; private set; }
    }
}