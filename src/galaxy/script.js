import * as THREE from 'three'
import galaxyVertexShader from './shaders/vertex.glsl'
import galaxyFragmentShader from './shaders/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 400000
parameters.radius = 4
parameters.branches = 10
parameters.spin = 2
parameters.randomness = 0.05
parameters.randomnessPower = 2.5
parameters.insideColor = '#fb4437'
parameters.outsideColor = '#61baff'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
  // Destroy old galaxy
  if (points !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  const scales = new Float32Array(parameters.count * 1)
  const randomness = new Float32Array(parameters.count * 3)

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    // Position
    const i3 = i * 3

    const radius = Math.random() * parameters.radius

    const spinAngle = radius * parameters.spin
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius
    positions[i3 + 1] = 0
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius

    randomness[i3 + 0] = randomX
    randomness[i3 + 1] = randomY
    randomness[i3 + 2] = randomZ

    // Color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    scales[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(colors, 1))
  geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))

  /**
   * Material
   */
  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uSize: { value: 20 * renderer.getPixelRatio() },
      uTime: { value: 0 },
      uRandomness: { value: parameters.randomness },
    },
  })

  /**
   * Points
   */
  points = new THREE.Points(geometry, material)
  scene.add(points)
}

gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'radius')
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

generateGalaxy()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  material.uniforms.uTime.value = elapsedTime
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  parameters.randomness += clock.getElapsedTime()
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
