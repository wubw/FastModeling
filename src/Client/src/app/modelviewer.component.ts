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
    @ViewChild('mainviewer') mainviewer;
    title = 'model viewer';
    currentAngle: number[] = [0.0, 0.0];
    modelMatrix: any;
    u_ModelMatrix: any;
    gl: any;
    program: any;
    dragging: boolean;
    lastX: number;
    lastY: number;
    vertices: Float32Array;
    n: number;

    constructor(private retrieveModelService: RetrieveModelService) {
        var cm = require("./common/coun-matrix");
        this.modelMatrix = new cm.Matrix4();
    }

    ngOnInit(): void {
        this.retrieveModelService.modelRetrieved().subscribe(m => {
            this.drawRetrievedModel(m);
        });

        if(!this.mainviewer) {
            console.log('ngOnInit: Fail to retrieve the mainviewer <canvas> element');
        }
        this.gl  = this.mainviewer.nativeElement.getContext('webgl');
        this.initEventHandlers(this.mainviewer.nativeElement);
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

        this.u_ModelMatrix = this.gl.getUniformLocation(this.program, 'u_xformMatrix');
        
        this.setFragmentColor();

        this.tick();
    }

    initEventHandlers(canvas) {
        this.dragging = false;
        this.lastX = -1;
        this.lastY = -1;

        canvas.onmousedown = ev => {
            var x = ev.clientX, y = ev.clientY;
            var rect = ev.target.getBoundingClientRect();
            if(rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
                this.lastX = x;
                this.lastY = y;
                this.dragging = true;
            }
        }

        canvas.onmouseup = ev => {
            this.dragging = false;
        }
        
        canvas.onmousemove = ev => {
            var x = ev.clientX, y = ev.clientY;
            if(this.dragging) {
                var factor = 100/canvas.height;
                var dx = factor * (x - this.lastX);
                var dy = factor * (y - this.lastY);
                this.currentAngle[0] = Math.max(Math.min(this.currentAngle[0] + dy, 90.0), -90.0);
                this.currentAngle[1] = this.currentAngle[1] + dx;
            }
            this.lastX = x;
            this.lastY = y;
        }
    }

    drawRetrievedModel(m) : void {
        console.log('model retrieved %s', m);
        var d = JSON.parse(m);
        this.n = d.Vertices.length;
        this.vertices = new Float32Array(this.n * 3);
        var i = 0;
        for(let v of d.Vertices) {
            this.vertices[i] = v.X;
            this.vertices[i+1] = v.Y;
            this.vertices[i+2] = v.Z;
            i = i + 3;
        }
        this.draw();
    }

    draw(): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        if(!this.n || this.n <= 0) {
            return;
        }
        var ret = this.initVertexBuffer(this.vertices);
        this.modelMatrix.rotate(this.currentAngle[0], 1.0, 0.0, 0.0);
        this.modelMatrix.rotate(this.currentAngle[1], 0.0, 1.0, 0.0);
        this.currentAngle = [0.0, 0.0];
        this.gl.uniformMatrix4fv(this.u_ModelMatrix, false, this.modelMatrix.elements);
        if(ret < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.n);
    }

    tick() {
        this.draw();
        requestAnimationFrame(() => {this.tick()});
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
        this.gl.vertexAttribPointer(a_Position, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(a_Position);

        return 0;
    }
}