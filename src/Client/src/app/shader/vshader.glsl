attribute vec4 a_Position;
attribute float a_PointSize;
uniform vec4 u_Translation;
uniform float u_CosB, u_SinB;

void main() {
    gl_Position.x = a_Position.x*u_CosB - a_Position.y*u_SinB + u_Translation.x;
    gl_Position.y = a_Position.x*u_SinB + a_Position.y*u_CosB + u_Translation.y;
    gl_Position.z = a_Position.z + u_Translation.z;
    gl_Position.w = 1.0;
    gl_PointSize = a_PointSize;
}
