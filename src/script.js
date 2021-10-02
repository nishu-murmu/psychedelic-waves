import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import VShader from './shaders/vertex.glsl'
import FShader from './shaders/fragment.glsl'
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const imageLoader = new THREE.TextureLoader()
const img = imageLoader.load('images/liquid2.jpg')
img.repeat = new THREE.Vector2(0, 2)
img.wrapS = img.wrapT = THREE.RepeatWrapping
img.offset = new THREE.Vector2(0, 0.5)
// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 5)
scene.add(camera)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Cube
 */
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 10, 100, 100),
    new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 0 },
            liquid: { type: 't', value: img }
        },
        vertexShader: VShader,
        fragmentShader: FShader
    })
)

scene.add(plane)

const pointLight = new THREE.DirectionalLight(0xffffff, 1)
pointLight.position.set(0, 3, 5)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)

scene.add(pointLight, ambientLight)

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / sizes.width * 2 - 1
    mouse.y = -(e.clientY / sizes.height) * 2 + 1
})
/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime
    raycaster.setFromCamera( mouse, camera )
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        let len = intersects[i].object.geometry.attributes.position.array.length
    }
    // Update controls
    plane.material.uniforms.time.value = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
