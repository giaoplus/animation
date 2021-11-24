import * as THREE from 'three'

export default function main() {
  const canvas = document.getElementById('main')
  const renderer = new THREE.WebGLRenderer({canvas})

  // 视野范围（垂直方向的角度）
  const fov = 90
  // 画布宽高比例
  const aspet = 1
  // 视锥远近平面
  const far = 5
  const near = 0.1
  const camera = new THREE.PerspectiveCamera(fov, aspet, near, far)
  camera.position.z = 4

  const scene = new THREE.Scene()
  
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;

  function makeInstance(geometry, color, x, y, z) {
    const material = new THREE.MeshPhongMaterial({color});
   
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
   
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
   
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x8844aa, -4, 2, -1),
    makeInstance(geometry, 0x44aa88,  0, 0, 0),
    makeInstance(geometry, 0xaa8844,  4, -2, 1),
  ];

  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  renderer.render(scene, camera);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;  // 将时间单位变为秒

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
   
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}