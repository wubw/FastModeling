/// <reference path="./common/webgl-utils.d.ts" />

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Face, Model } from './model';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';      

import { RetrieveModelService } from './retrieve.model.service';

declare let initShaders:any;
declare let Matrix4:any;
declare let Vector3:any;

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
    viewMatrix: any;
    gl: any;
    program: any;
    dragging: boolean;
    lastX: number;
    lastY: number;
    models: Model[] = [];
    needDraw: boolean = true;

    constructor(private retrieveModelService: RetrieveModelService) {
        this.viewMatrix = new Matrix4();
    }

    ngOnInit(): void {
        this.retrieveModelService.modelRetrieved().subscribe(m => this.drawRetrievedModel(m));
        this.retrieveModelService.modelReset().subscribe(() => this.resetModel() );

        if(!this.mainviewer) {
            console.log('ngOnInit: Fail to retrieve the mainviewer <canvas> element');
        }
        this.gl  = this.mainviewer.nativeElement.getContext('webgl');
        this.initEventHandlers(this.mainviewer.nativeElement);
        if (!this.gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }

        this.program = initShaders(this.gl, "app/shader/vshader.glsl", "app/shader/fshader.glsl");
        if(!this.program) {
            console.log('Failed to init shaders');
            return;
        }
        this.gl.useProgram(this.program);
        this.gl.viewport(0, 0, this.mainviewer.nativeElement.width, this.mainviewer.nativeElement.height);
        
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
                if(ev.ctrlKey || ev.shiftKey) {
                    this.lastX = x;
                    this.lastY = y;
                    this.dragging = true;
                } else {
                    this.checkSelection(x-rect.left, rect.bottom-y);
                }
            }
        }

        canvas.onmouseup = ev => {
            this.dragging = false;
        }

        canvas.onmousemove = ev => {
            var x = ev.clientX, y = ev.clientY;
            if(this.dragging) {
                if(ev.ctrlKey) {
                    var factor = 100/canvas.height;
                    var dx = factor * (x - this.lastX);
                    var dy = factor * (y - this.lastY);
                    this.currentAngle[0] = Math.max(Math.min(this.currentAngle[0] + dy, 90.0), -90.0);
                    this.currentAngle[1] = this.currentAngle[1] + dx;
                    this.lastX = x;
                    this.lastY = y;

                    this.viewMatrix.rotate(-1 * this.currentAngle[0], 1.0, 0.0, 0.0);
                    this.viewMatrix.rotate(-1 * this.currentAngle[1], 0.0, 1.0, 0.0);
                    this.currentAngle = [0.0, 0.0];

                    this.needDraw = true;
                } else if(ev.shiftKey) {
                    var dx = (x - this.lastX)/canvas.height;
                    var dy = (y - this.lastY)/canvas.height;
                    this.lastX = x;
                    this.lastY = y;
                    var selectedModels = this.getSelectedModels();
                    for(var i = 0; i < selectedModels.length; i++) {
                        var m = selectedModels[i];
                        m.modelMatrix.translate(dx, -1*dy, 0);
                    }
                    this.needDraw = true;
                } else {
                    this.needDraw = false;
                }
            }
        }

        canvas.onmousewheel = ev => {
            var scaledown = 0.9;
            var scaleup = 1.1;
            if (ev.wheelDelta < 0) {
                this.viewMatrix.scale(scaledown, scaledown, scaledown);
            } else if (ev.wheelDelta > 0) {
                this.viewMatrix.scale(scaleup, scaleup, scaleup);
            }
            this.needDraw = true;
        }
    }

    drawRetrievedModel(m) : void {
        console.log('model retrieved %s', m);
        var surfaceVertices:number[] = [];
        var surfaceNormals:number[] = [];
        var n:number = 0;
        if (m != null) {
            var d = JSON.parse(m);
            for (let f of d.Faces) {
                for (let v of f.Vertices) {
                    i = i + 3;
                    surfaceVertices.push(v.X);
                    surfaceVertices.push(v.Y);
                    surfaceVertices.push(v.Z);
                    n = n + 1;
                }
                for (var j = 0; j < f.Vertices.length * 3; j = j + 3) {
                    surfaceNormals.push(f.Normal.X);
                    surfaceNormals.push(f.Normal.Y);
                    surfaceNormals.push(f.Normal.Z);
                }
            }
        }

        var surface = new Face();
        surface.n = n;
        surface.vertices = new Float32Array(n * 3);
        surface.normals = new Float32Array(n * 3);
        for(var i = 0; i < surfaceVertices.length; i++) {
            surface.vertices[i] = surfaceVertices[i];
        }
        for(var i = 0; i < surfaceNormals.length; i++) {
            surface.normals[i] = surfaceNormals[i];
        }
        
        var model = new Model();
        model.surface = surface;
        this.models.push(model);

        this.needDraw = true;
        this.draw();
    }

    draw(): void {
        if(!this.needDraw) {
            return;
        }
        
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        var u_viewMatrix = this.gl.getUniformLocation(this.program, 'u_viewMatrix');
        this.gl.uniformMatrix4fv(u_viewMatrix, false, this.viewMatrix.elements);

        for(var i = 0; i < this.models.length; i++) {
            var m = this.models[i];
            this.drawModel(m);
        }       

        this.needDraw = false;
    }

    drawModel(m: Model) {
        var a_Color = this.gl.getUniformLocation(this.program, 'a_Color');
        if (m.selected) {
            this.gl.uniform4f(a_Color, 1.0, 1.0, 0.0, 1.0);
        } else {
            this.gl.uniform4f(a_Color, 1.0, 0.0, 0.0, 1.0);
        }
        var u_modelMatrix = this.gl.getUniformLocation(this.program, 'u_modelMatrix');
        this.gl.uniformMatrix4fv(u_modelMatrix, false, m.modelMatrix.elements);
        if (m.surface.n > 0) {
            this.initArrayBuffer(m.surface.vertices, 3, this.gl.FLOAT, 'a_Position');
            this.initArrayBuffer(m.surface.normals, 3, this.gl.FLOAT, 'a_Normal');
            this.gl.drawArrays(this.gl.TRIANGLES, 0, m.surface.n);
        }
    }

    tick() {
        this.draw();
        requestAnimationFrame(() => {this.tick()});
    }

    setLight(): void {
        var u_LightColor = this.gl.getUniformLocation(this.program, 'u_LightColor');
        var u_LightDirection = this.gl.getUniformLocation(this.program, 'u_LightDirection');
        this.gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        var lightDirection = new Vector3([5, 3.0, 4.0]);
        lightDirection.normalize();
        this.gl.uniform3fv(u_LightDirection, lightDirection.elements);
        var u_AmbientLight = this.gl.getUniformLocation(this.program, 'u_AmbientLight');
        this.gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    }

    initArrayBuffer(data, num: number, type, attribute:string): boolean {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        var a_attribute = this.gl.getAttribLocation(this.program, attribute);
        this.gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
        this.gl.enableVertexAttribArray(a_attribute);
        
        return true;
    } 

    checkSelection(x: number, y: number) {
        this.needDraw = true;
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        var pixels = new Uint8Array(4);
        for (var i = 0; i < this.models.length; i++) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            var m = this.models[i];
            m.selected = false;
            this.drawModel(m);
            this.gl.readPixels(x, y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
            if (pixels[0] != 0 || pixels[1] != 0 || pixels[2] != 0) {
                m.selected = true;
            }
        }     

        this.needDraw = true;
    }

    getSelectedModels() {
        var selectedModels:Model[] = [];
        for (var i = 0; i < this.models.length; i++) {
            var m = this.models[i];
            if(m.selected) {
                selectedModels.push(m);
            }
        }
        return selectedModels;
    }

    resetModel() {
        this.models = [];
        this.needDraw = true;
    }
}