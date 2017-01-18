/// <reference path="./common/webgl-utils.d.ts" />

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';      

@Component({
  selector: 'model-viewer',
  templateUrl: './modelviewer.component.html',
  styleUrls: ['./modelviewer.component.css'],
  queries: { mainviewer : new ViewChild('mainviewer') }
})
export class ModelViewerComponent implements OnInit {
    @ViewChild('mainviewer') mainviewer;
    title = 'model viewer';
    anglestep = 45.0;
    g_last = Date.now();
    currentAngle = 0.0;
    modelMatrix: any;
    u_ModelMatrix: any;
    gl: any;
    n: number;

    ngOnInit(): void {
        if(!this.mainviewer) {
            console.log('ngOnInit: Fail to retrieve the mainviewer <canvas> element');
        }
        this.gl  = this.mainviewer.nativeElement.getContext('webgl');
        if (!this.gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }
        var ir = require("./common/initShaders2");
        var program = ir.initShaders(this.gl, "app/shader/vshader.glsl", "app/shader/fshader.glsl");
        if(!program) {
            console.log('Failed to init shaders');
            return;
        }
        this.gl.useProgram(program);
        this.gl.viewport(0, 0, this.mainviewer.nativeElement.width, this.mainviewer.nativeElement.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        var ANGLE = 90.0;
        this.u_ModelMatrix = this.gl.getUniformLocation(program, 'u_xformMatrix');
        var cm = require("./common/coun-matrix");
        var xformMatrix = new cm.Matrix4();
        xformMatrix.setTranslate(0.5, 0.5, 0.0);
        xformMatrix.rotate(ANGLE, 0, 0, 1);
        this.modelMatrix = xformMatrix;

        this.gl.uniformMatrix4fv(this.u_ModelMatrix, false, xformMatrix.elements);
        
        this.setPointSize(program);
        this.setFragmentColor(program);

        this.n = this.initVertexBuffer(program);
        if(this.n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }

        //this.gl.drawArrays(this.gl.TRIANGLES, 0, this.n);

        this.tick();
    }

    animate():void {
        var now = Date.now();
        var elapsed = now - this.g_last;
        this.g_last = now;
        var newAngle = this.currentAngle + (this.anglestep * elapsed) / 1000.0;
        this.currentAngle = (newAngle %= 360.0);
    }

    tick() {
        this.animate();
        console.log(this.currentAngle);
        this.draw(this.n, this.currentAngle, this.modelMatrix, this.u_ModelMatrix);
        requestAnimationFrame(()=>this.tick());
    }

    draw(n, currentAngle, modelMatrix, u_ModelMatrix) {
        modelMatrix.setRotate(currentAngle, 0, 0, 1);
        this.gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, n);
    }

    setPointSize(program): void {
        var a_PointSize = this.gl.getAttribLocation(program, 'a_PointSize');
        this.gl.vertexAttrib1f(a_PointSize, 5.0);
    }

    setFragmentColor(program): void {
        var u_FragColor = this.gl.getUniformLocation(program, 'u_FragColor');
        this.gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    }

    initVertexBuffer(program): number {
        var vertices = new Float32Array([
            0.0, 0.5, -0.5, -0.5, 0.5, -0.5
        ])
        var n = 3;

        var vertexBuffer = this.gl.createBuffer();
        if(!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        
        var a_Position = this.gl.getAttribLocation(program, 'a_Position');
        if(a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(a_Position);

        return n;
    }
}