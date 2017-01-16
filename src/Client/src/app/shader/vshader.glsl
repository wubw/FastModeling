attribute vec4 a_Position;
attribute float a_PointSize;
uniform mat4 u_xformMatrix;

void main() {
    gl_Position = u_xformMatrix * a_Position;
    gl_PointSize = a_PointSize;
}
