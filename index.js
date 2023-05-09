import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    MOUSE,
    Clock,
    AxesHelper,
    GridHelper,
    AmbientLight,
    DirectionalLight


  } from "three";
  import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
  
  
  import CameraControls from 'camera-controls';
  
  const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
      DEG2RAD: MathUtils.DEG2RAD,
      clamp: MathUtils.clamp
    }
  };

import { IFCLoader } from "web-ifc-three";
const input = document.getElementById("file-input")
const ifcLoader= new IFCLoader()



const canvas=document.getElementById("three-canvas")

const scene=new Scene();

//2 The Object

const grid = new GridHelper(50,30);
grid.material.depthTest = false;
grid.renderOrder = 1;
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 2;
scene.add(axes);

ifcLoader.ifcManager.setupThreeMeshBVH(computeBoundsTree,disposeBoundsTree,acceleratedRaycast);

//Picking logic
const ifcModels=[]

//4 Load IFC model
input.addEventListener(
  "change",
  async (changed)=>{
    const ifcURL=URL.createObjectURL(changed.target.files[0]);
    const model=await ifcLoader.loadAsync(ifcURL);
    scene.add(model);
    ifcModels.push(model);
  },
  false
)
//Raycaster
const raycaster= new Raycaster();
raycaster.firstHitOnly=true;
const mouse=new Vector2();

function cast(event){
  const bounds=canvas.getBoundingClientRect();
  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  mouse.y = -(y1 / y2) * 2 + 1;

  // Places it on the camera pointing to the mouse
  raycaster.setFromCamera(mouse, camera);

  // Casts a ray
  return raycaster.intersectObjects(ifcModels);

}

function pick(event){
  const found=cast(event)[0];
  if (found) {
    const index = found.faceIndex;
    const geometry = found.object.geometry;
    const ifc = ifcLoader.ifcManager;
    const id = ifc.getExpressId(geometry, index);
    console.log(id);
  }
}

//event for mouse double click
canvas.ondblclick=(event)=>pick(event);

//3 The Camera
const camera = new PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight
);
camera.position.z = 3;
camera.position.y = 6;
camera.lookAt(grid);
scene.add(camera);

//Creates the lights of the scene
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 2);
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);

//4 The Renderer
const renderer = new WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setClearColor(0xFFFFFF, 1);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// Controls
CameraControls.install( { THREE: subsetOfTHREE } ); 
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);

function animate() {



  const delta = clock.getDelta();
	cameraControls.update( delta );
	renderer.render( scene, camera );
  requestAnimationFrame(animate);
}

animate();


