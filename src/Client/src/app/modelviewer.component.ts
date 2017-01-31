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
    normals: Float32Array;
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
        
        this.setLight();

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
        this.normals = new Float32Array(this.n * 3);
        i = 0;
        for(let n of d.Normals) {
            this.normals[i] = n.X;
            this.normals[i+1] = n.Y;
            this.normals[i+2] = n.Z;
            i = i + 3;
        }
        var a_Color = this.gl.getUniformLocation(this.program, 'a_Color');
        this.gl.uniform4f(a_Color, 1.0, 0.0, 0.0, 1.0);
        this.draw();
    }

    draw(): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        if(!this.n || this.n <= 0) {
            return;
        }
        if(!this.initArrayBuffer(this.vertices, 3, this.gl.FLOAT, 'a_Position')) {
            return;
        }
        if(!this.initArrayBuffer(this.normals, 3, this.gl.FLOAT, 'a_Normal')) {
            return;
        }

        this.modelMatrix.rotate(-1 * this.currentAngle[0], 1.0, 0.0, 0.0);
        this.modelMatrix.rotate(-1 * this.currentAngle[1], 0.0, 1.0, 0.0);
        this.currentAngle = [0.0, 0.0];
        this.gl.uniformMatrix4fv(this.u_ModelMatrix, false, this.modelMatrix.elements);
        console.log('draw');
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.n);
    }

    tick() {
        this.draw();
        requestAnimationFrame(() => {this.tick()});
    }

    setLight(): void {
        var u_LightColor = this.gl.getUniformLocation(this.program, 'u_LightColor');
        var u_LightDirection = this.gl.getUniformLocation(this.program, 'u_LightDirection');
        this.gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        var cm = require("./common/coun-matrix");
        var lightDirection = new cm.Vector3([5, 3.0, 4.0]);
        lightDirection.normalize();
        this.gl.uniform3fv(u_LightDirection, lightDirection.elements);
    }

    initArrayBuffer(data, num: number, type, attribute:string): boolean {
        console.log('data,' + attribute + ': ' + data);
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        var a_attribute = this.gl.getAttribLocation(this.program, attribute);
        this.gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
        this.gl.enableVertexAttribArray(a_attribute);
        
        return true;
    } 
}