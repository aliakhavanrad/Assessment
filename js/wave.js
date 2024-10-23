import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
 * Geometry
 */

const plane = new THREE.PlaneGeometry(100, 100, 512, 512);

const material = new THREE.ShaderMaterial( { 
    color: 0xbb0000,
    side: THREE.DoubleSide,
    vertexShader: 
    `
    uniform float uTime;

    void main()
    {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        float elevation = sin(0.03 * uTime * modelPosition.x) * 1.5 + cos(0.02 * uTime * modelPosition.z) * 1.5;
        modelPosition.y += elevation;

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;
    }
    `,
    fragmentShader:
    `
    void main()
    {
        gl_FragColor = vec4(0.45, 0.84, 1.0, 1.0);
    }
    `,
    uniforms: {
        uTime: { value: 0.0}
    }
} );

const mesh = new THREE.Mesh( plane, material );
mesh.rotateX(-Math.PI / 2 + .3)
mesh.position.set( 0, 0, 0 );
scene.add( mesh );


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.x = 60
camera.position.y = 0
camera.position.z = 80
camera.lookAt(new THREE.Vector3(0,0,0));
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
 * Controls
 */

const controls = new OrbitControls( camera, renderer.domElement );

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    material.uniforms.uTime.value = elapsedTime;
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()