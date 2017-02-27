declare let Matrix4:any;

export class Model {
    surface: Face = new Face();
    selected: boolean = false;
    modelMatrix: any;

    constructor() {
        this.modelMatrix = new Matrix4();
    }
}

export class Face {
    vertices: Float32Array;
    normals: Float32Array;
    n: number;
}