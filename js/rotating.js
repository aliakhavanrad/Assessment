import * as THREE from 'three'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 0
scene.add(camera)

/**
 * Geometry
 */

const box = new THREE.BoxGeometry( 30, 30, 30 );

const material = new THREE.MeshPhongMaterial( { color: 0xffaa00, flatShading: true, shininess: 0 } );

const mesh = new THREE.Mesh( box, material );
mesh.position.set( 0, 0, -100 );
scene.add( mesh );


/**
 * Light
 */
let directionalLight = new THREE.DirectionalLight( 0xffffff, 1.3 );
directionalLight.target = mesh;
scene.add( directionalLight );

let ambientLight = new THREE.AmbientLight( 0xffffff, .3 );
scene.add( ambientLight );


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
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    mesh.rotateX(deltaTime * .9);
    mesh.rotateY(deltaTime * .5);

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()