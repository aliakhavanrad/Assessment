import * as THREE from 'three'

const frustumSize = 4;
const coords = new THREE.Vector3();
let index = 0;
let isPointerDown = false;

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
  const aspect = window.innerWidth / window.innerHeight;

  camera.left = -frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

})

/**
 * Geometry
 */

const lineGeometry = new THREE.BufferGeometry();

const positionAttribute = new THREE.BufferAttribute(new Float32Array(2 * 3), 3);
positionAttribute.setUsage(THREE.DynamicDrawUsage);
lineGeometry.setAttribute('position', positionAttribute);

const material = new THREE.LineBasicMaterial({ color: 0x00aa00})

const line = new THREE.Line(lineGeometry, material);
scene.add(line);


/**
 * Box
 */

const boxGeometry = new THREE.BoxGeometry(.5, .15, .15);
const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa
})
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.visible = false;


/**
 * Camera
 */

const aspect = window.innerWidth / window.innerHeight;

const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 20);
camera.position.z = 5;
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

renderer.domElement.addEventListener('pointerdown', onPointerDown);
renderer.domElement.addEventListener('pointerup', onPointerUp);
renderer.domElement.addEventListener('pointermove', onPointerMove);


function addPoint(x, y, z) {

    const positionAttribute = line.geometry.getAttribute('position');
    positionAttribute.setXYZ(0, x, y, z);
    //positionAttribute.needsUpdate = true;
    
    line.geometry.setDrawRange(0, 2);
  
  }
  
  function updatePoint(x, y, z) {
  
    const positionAttribute = line.geometry.getAttribute('position');
    positionAttribute.setXYZ(1, x, y, 0);    
    positionAttribute.needsUpdate = true;  
  }

  function updateBox (box, line) {
    
    const positionAttribute = line.geometry.getAttribute('position');
    let linePointsArray = positionAttribute.array;
    let x0 = linePointsArray[0];
    let y0 = linePointsArray[1];
    let x1 = linePointsArray[3];
    let y1 = linePointsArray[4];

    let boxX = (x0 + x1) / 2;
    let boxY = (y0 + y1) / 2;

    box.position.set(boxX, boxY, 0)
    box.visible = true;
  }
  
  function onPointerDown(event) {
  
    coords.x = (event.clientX / window.innerWidth) * 2 - 1;
    coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
    coords.z = (camera.near + camera.far) / (camera.near - camera.far);
  
    coords.unproject(camera);
  
    addPoint(coords.x, coords.y, 0);
    
    isPointerDown = true;
  }

  function onPointerUp(event) {
  
    isPointerDown = false;
  }
  
  function onPointerMove(event) {
  
    if(!isPointerDown) {
        return;
    }

    coords.x = (event.clientX / window.innerWidth) * 2 - 1;
    coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
    coords.z = (camera.near + camera.far) / (camera.near - camera.far);
  
    coords.unproject(camera);
  
    updatePoint(coords.x, coords.y, 0) 
    updateBox(box, line);

  }

/**
 * Animate
 */

const tick = () =>
{
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()