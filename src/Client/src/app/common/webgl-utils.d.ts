interface Window
{
    WebGLRenderingContext?: any;
    requestAnimFrame(callback: any, element?: any): void;
    webkitRequestAnimationFrame(callback: any, element?: any): void;
    mozRequestAnimationFrame(callback: any, element?: any): void;
    oRequestAnimationFrame(callback: any, element?: any): void;
}

declare var WebGLUtils:
{
    create3DContext: (canvas: HTMLElement, opt_attribs?: any) => any;
    setupWebGL: (canvas: HTMLElement, opt_attribs?: any) => WebGLRenderingContext;
};