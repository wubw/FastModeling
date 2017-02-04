attribute vec4 a_Position;
uniform vec4 a_Color; // should be attribute
attribute float a_PointSize;
uniform mat4 u_xformMatrix;
attribute vec4 a_Normal;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;
varying vec4 v_Color;

void main() {
    gl_Position = u_xformMatrix * a_Position;
    gl_PointSize = a_PointSize;
    vec3 normal = normalize(vec3(u_xformMatrix * a_Normal));
    float nDotL = max(dot(u_LightDirection, normal), 0.0);
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, a_Color.a);
}
