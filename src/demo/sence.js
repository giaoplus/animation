import * as THREE from 'three'
import { GUI } from 'dat.gui'

export default function main() {
  const gui = new GUI()
  const canvas = document.getElementById('main')
  const renderer = new THREE.WebGLRenderer({canvas})

  // 视野范围（垂直方向的角度）
  const fov = 40
  // 画布宽高比例
  const aspet = 2
  // 视锥远近平面
  const far = 1000
  const near = 0.1
  const camera = new THREE.PerspectiveCamera(fov, aspet, near, far)
  camera.position.set(0, 150, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene()

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  const objects = []

  const radius = 1
  const widthSegments = 6
  const heightSegments = 6
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)

  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);

  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
  sunMesh.scale.set( 5, 5, 5)
  solarSystem.add(sunMesh)
  objects.push(sunMesh)
  
  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10
  solarSystem.add(earthOrbit)
  objects.push(earthOrbit)

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  })
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
  earthOrbit.add(earthMesh)
  objects.push(earthMesh)

  const moonOrbit  = new THREE.Object3D()
  moonOrbit.position.x = 2
  earthOrbit.add(moonOrbit)

  const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(.5, .5, .5);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  // 为每个节点添加一个AxesHelper
  // objects.forEach((node) => {
  //   const axes = new THREE.AxesHelper();
  //   axes.material.depthTest = false;
  //   axes.renderOrder = 1;
  //   node.add(axes);
  // });

  // 打开/关闭轴和网格的可见性
  // dat.GUI 要求一个返回类型为bool型的属性
  // 来创建一个复选框，所以我们为 `visible`属性
  // 绑定了一个setter 和 getter。 从而让dat.GUI
  // 去操作该属性.
  class AxisGridHelper {
    constructor(node, units = 10) {
      const axes = new THREE.AxesHelper();
      axes.material.depthTest = false;
      axes.renderOrder = 2; // 在网格渲染之后再渲染
      node.add(axes);
  
      const grid = new THREE.GridHelper(units, units);
      grid.material.depthTest = false;
      grid.renderOrder = 1;
      node.add(grid);
  
      this.grid = grid;
      this.axes = axes;
      this.visible = false;
    }
    get visible() {
      return this._visible;
    }
    set visible(v) {
      this._visible = v;
      this.grid.visible = v;
      this.axes.visible = v;
    }
  }

  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
  }

  makeAxisGrid(solarSystem, 'solarSystem', 25);
  makeAxisGrid(sunMesh, 'sunMesh');
  makeAxisGrid(earthOrbit, 'earthOrbit');
  makeAxisGrid(earthMesh, 'earthMesh');
  makeAxisGrid(moonOrbit, 'moonOrbit');
  makeAxisGrid(moonMesh, 'moonMesh');

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

    objects.forEach((obj) => {
      obj.rotation.y = time;
    });
   
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}