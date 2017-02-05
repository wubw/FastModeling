export class Model {
    surface: Face = new Face();
    selected: boolean = false;
}

export class Face {
    vertices: Float32Array;
    normals: Float32Array;
    n: number;
}