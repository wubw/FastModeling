export class Model {
    surface: Face = new Face();
    selected: boolean = false;
    modelMatrix: any;

    constructor() {
        var cm = require("./common/coun-matrix");
        this.modelMatrix = new cm.Matrix4();
    }
}

export class Face {
    vertices: Float32Array;
    normals: Float32Array;
    n: number;
}