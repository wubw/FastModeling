/// <reference path="./common/webgl-utils.d.ts" />

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';      

import { RetrieveModelService } from './retrieve.model.service';

@Component({
  selector: 'model-viewer',
  templateUrl: './modelviewer.component.html',
  styleUrls: ['./modelviewer.component.css'],
  queries: { mainviewer : new ViewChild('mainviewer') }
})
export class ModelViewerComponent implements OnInit {
    constructor(private retrieveModelService: RetrieveModelService) {}
    
    @ViewChild('mainviewer') mainviewer;
    title = 'model viewer';
    anglestep = 45.0;
    g_last = Date.now();
    currentAngle = 0.0;
    modelMatrix: any;
    u_ModelMatrix: any;
    gl: any;
    program: any;

    ngOnInit(): void {
        this.retrieveModelService.modelRetrieved().subscribe(m => {
            this.drawRetrievedModel(m);
        });

        if(!this.mainviewer) {
            console.log('ngOnInit: Fail to retrieve the mainviewer <canvas> element');
        }
        this.gl  = this.mainviewer.nativeElement.getContext('webgl');
        if (!this.gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }
        var ir = require("./common/initShaders2");
        this.program = ir.initShaders(this.gl, "app/shader/vshader.glsl", "app/shader/fshader.glsl");
        if(!this.program) {
            console.log('Failed to init shaders');
            return;
        }
        this.gl.useProgram(this.program);
        this.gl.viewport(0, 0, this.mainviewer.nativeElement.width, this.mainviewer.nativeElement.height);

        var ANGLE = 90.0;
        this.u_ModelMatrix = this.gl.getUniformLocation(this.program, 'u_xformMatrix');
        var cm = require("./common/coun-matrix");
        var xformMatrix = new cm.Matrix4();
        xformMatrix.setTranslate(0.5, 0.5, 0.0);
        xformMatrix.rotate(ANGLE, 0, 0, 1);
        this.modelMatrix = xformMatrix;

        this.gl.uniformMatrix4fv(this.u_ModelMatrix, false, xformMatrix.elements);
        
        this.setFragmentColor();

        var vertices = new Float32Array([
            -0.5, 0.5, -0.5, -0.5, 0.5, -0.5,  
        ]);
        var n = 3;
        this.draw(vertices, n);
    }

    drawRetrievedModel(m) : void {
        console.log('model retrieved %s', m);
        var d = JSON.parse(m);
        var n = d.Vertices.length;
        var vertices = new Float32Array(n * 2);
        var i = 0;
        for(let v of d.Vertices) {
            vertices[i] = v.X;
            vertices[i+1] = v.Y;
            i = i + 2;
        }
        this.draw(vertices, n);
    }

    draw(vertices, n): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        var ret = this.initVertexBuffer(vertices);
        if(ret < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }

        this.gl.drawArrays(this.gl.TRIANGLES, 0, n);
    }

    setFragmentColor(): void {
        var u_FragColor = this.gl.getUniformLocation(this.program, 'u_FragColor');
        this.gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    }

    initVertexBuffer(vertices): number {
        var vertexBuffer = this.gl.createBuffer();
        if(!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        
        var a_Position = this.gl.getAttribLocation(this.program, 'a_Position');
        if(a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(a_Position);

        return 0;
    }
}