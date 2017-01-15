/// <reference path="./common/webgl-utils.d.ts" />

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import './common/initShaders2.js';        

@Component({
  selector: 'model-viewer',
  templateUrl: './modelviewer.component.html',
  styleUrls: ['./modelviewer.component.css'],
  queries: { mainviewer : new ViewChild('mainviewer') }
})
export class ModelViewerComponent implements OnInit, AfterViewInit {
    @ViewChild('mainviewer') mainviewer;
    title = 'model viewer';

    ngOnInit(): void {
        if(!this.mainviewer) {
            console.log('ngOnInit: Fail to retrieve the mainviewer <canvas> element');
        }
        var gl  = this.mainviewer.nativeElement.getContext('webgl');
        if (!gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }
        var ir = require("./common/initShaders2");
        var program = ir.initShaders(gl, "app/shader/vshader.glsl", "app/shader/fshader.glsl");
        if(!program) {
            console.log('Failed to init shaders');
            return;
        }
        gl.useProgram(program);
        
        gl.viewport(0, 0, this.mainviewer.nativeElement.width, this.mainviewer.nativeElement.height);
        gl.clearColor(0.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
        var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
        gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0)
        gl.vertexAttrib1f(a_PointSize, 5.0);

        var n = this.initVertexBuffer(gl, program);
        if(n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        gl.drawArrays(gl.POINTS, 0, n);
    }
    
    ngAfterViewInit(): void {
    }

    initVertexBuffer(gl, program): number {
        var vertices = new Float32Array([
            0.0, 0.5, -0.5, -0.5, 0.5, -0.5
        ])
        var n = 3;

        var vertexBuffer = gl.createBuffer();
        if(!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        var a_Position = gl.getAttribLocation(program, 'a_Position');
        if(a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        return n;
    }
}