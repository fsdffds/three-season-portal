import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { petalAnimate, SpringScene } from './springScene';
import { SummerScene } from './summerScene';
import { FallScene } from './fallScene';
import { winterAnimate, WinterScene } from './winterScene';

// 기본 scene, camera, renderer 설정
const h_scr = window.innerWidth;
const v_scr = window.innerHeight;
const homeScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, h_scr / v_scr, 0.1, 1000);
camera.position.set(0, 12, 30)

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(h_scr, v_scr);

// OrbitControls 설정
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 0, 0);
controls.update();

// 사계절 scene
const springScene = new THREE.Scene();
SpringScene(springScene);
const summerScene = new THREE.Scene();
SummerScene(summerScene);
const fallScene = new THREE.Scene();
FallScene(fallScene)
const winterScene = new THREE.Scene();
let winterSceneData;
winterSceneData = WinterScene(winterScene);

springScene.background = new THREE.Color(0xE3F6FF);
summerScene.background = new THREE.Color(0x87CEEB);
fallScene.background = new THREE.Color(0x333355);
winterScene.background = new THREE.Color(0xcce0ff);

let currentScene = homeScene;

// 마우스 클릭
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 배경색
homeScene.background= new THREE.Color(0xf0f8ff);

// 집 하단
const baseGeometry = new THREE.CylinderGeometry(9, 9, 1, 64);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xF5F5F5 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -3;
base.receiveShadow = true;
homeScene.add(base);

// 집 (정육면체)
const houseGeometry = new THREE.BoxGeometry(5, 5, 5);
const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const house = new THREE.Mesh( houseGeometry, houseMaterial );
homeScene.add(house);

// 지붕
const roofGeometry = new THREE.ConeGeometry(4.5, 3, 4);
const roofTexture = new THREE.TextureLoader().load('./assets/texture/roof.jpg');
const roofMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x8B0000,
  map: roofTexture,
});
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 4;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// 문 4개
const doorGeometry = new THREE.PlaneGeometry(2.5, 4);

function createDoor(color, position, rotationY = 0) {
  const mat = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
  });

  const door = new THREE.Mesh(doorGeometry, mat);
  door.position.copy(position);
  door.rotation.y = rotationY;
  house.add(door);
  return door;
}

// 앞문(봄)
const frontDoor = createDoor(
  0xFFB7C5,
  new THREE.Vector3(0, -0.5, 2.5 + 0.01),
);

// 뒷문(가을)
const backDoor = createDoor(
  0xD28C3C,
  new THREE.Vector3(0, -0.5, -(2.5 + 0.01)),
  Math.PI,
);

// 오른쪽문(여름)
const rightDoor = createDoor(
  0x7FD1FF,
  new THREE.Vector3(2.5 + 0.01, -0.5, 0),
  Math.PI / 2,
);

// 왼쪽문(겨울)
const leftDoor = createDoor(
  0xE0F2FF,
  new THREE.Vector3(-(2.5 + 0.01), -0.5, 0),
  Math.PI / 2,
);

// 조명
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
homeScene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
homeScene.add(directionalLight);

// 카메라 위치 맞추기
function setCameraForScene(scene) {
  if (scene === homeScene) {
    camera.position.set(0, 12, 30);
    controls.target.set(0, 0, 0);
  } else {
    camera.position.set(15, 7, 0); // 계절씬 공통 뷰
    controls.target.set(0, 0, 0);
  }
  controls.update();
}

// 마우스 클릭 이벤트 핸들러
function onMouseClick(e) {
  // homeScene 일 때만 문 클릭
  if (currentScene !== homeScene) return;

  // 1. 마우스 위치를 정규화된 좌표(-1에서 +1)로 변환
  mouse.x = (e.clientX / h_scr) * 2 - 1;
  mouse.y = -(e.clientY / v_scr) * 2 + 1;

  // 2. Raycaster 설정
  raycaster.setFromCamera(mouse, camera);

  // 3. 충돌 객체 찾기 (homeScene에서 문 객체들만 검사)
  const intersects = raycaster.intersectObjects(house.children, false);

  if (intersects.length > 0) {
    // 가장 가까운 객체 (클릭된 문)
    const clickedDoor = intersects[0].object;

    // 4. 클릭된 문에 따라 currentScene 전환
    if (clickedDoor === frontDoor) {
      console.log('Front Door (Spring) clicked!');
      currentScene = springScene;
      setCameraForScene(currentScene);
    } else if (clickedDoor === backDoor) {
      console.log('Back Door (Autumn) clicked!');
      currentScene = fallScene;
      setCameraForScene(currentScene);
    } else if (clickedDoor === rightDoor) {
      console.log('Right Door (Summer) clicked!');
      currentScene = summerScene;
      setCameraForScene(currentScene);
    } else if (clickedDoor === leftDoor) {
      console.log('Left Door (Winter) clicked!');
      currentScene = winterScene;
      setCameraForScene(currentScene);
    }
    } else {
      console.log('문이 아닌 곳 클릭');
    }
}
window.addEventListener('click', onMouseClick);

// esc 누르면 홈 화면으로
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') currentScene = homeScene;
});

function animate() {
  controls.update();
  switch (currentScene){
    case springScene:
      petalAnimate();
      break;

    case winterScene:
      winterAnimate(winterSceneData, 10);
      break;
  }
  renderer.shadowMap.enabled = true;
  renderer.render(currentScene, camera);
}

renderer.setAnimationLoop(animate);
