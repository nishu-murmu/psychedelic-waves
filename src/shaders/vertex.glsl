varying vec2 vuv;
varying vec3 vNormal;
void main() {
    vNormal = normal;
    vuv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}