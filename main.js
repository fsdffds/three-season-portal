import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { petalAnimate, SpringScene } from './springScene';
import { SummerScene } from './summerScene';
import { FallScene } from './fallScene';
import { winterAnimate, WinterScene } from './assets/winterScene';

// 기본 scene, camera, renderer 설정
const h_scr = window.innerWidth;
const v_scr = window.innerHeight;
const homeScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, h_scr / v_scr, 0.1, 1000);
camera.position.set(7, 9, 0)

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

// springScene.background = new THREE.Color(0xFFFFFF);
summerScene.background = new THREE.Color(0x87CEEB);
fallScene.background = new THREE.Color(0x333355);
winterScene.background = new THREE.Color(0xcce0ff);

let currentScene = homeScene;

// 마우스 클릭
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 집 (정육면체)
const houseGeometry = new THREE.BoxGeometry(1, 1, 1);
const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const house = new THREE.Mesh( houseGeometry, houseMaterial );
homeScene.add(house);

// 문 4개
const doorGeometry = new THREE.PlaneGeometry(0.5, 0.8);
const doorMaterial = new THREE.MeshBasicMaterial( { color: 0x8B4513, side: THREE.DoubleSide } );

// 앞문(봄)
const frontDoor = new THREE.Mesh( doorGeometry, doorMaterial );
frontDoor.position.set(0, -0.1, 0.51);
house.add(frontDoor);

// 뒷문(가을)
const backDoor = new THREE.Mesh( doorGeometry, doorMaterial );
backDoor.position.set(0, -0.1, -0.51);
backDoor.rotation.y = Math.PI; // 180도 회전
house.add(backDoor);

// 오른쪽문(여름)
const rightDoor = new THREE.Mesh( doorGeometry, doorMaterial );
rightDoor.position.set(0.51, -0.1, 0);
rightDoor.rotation.y = Math.PI / 2;
house.add(rightDoor);

// 왼쪽문(겨울)
const leftDoor = new THREE.Mesh( doorGeometry, doorMaterial );
leftDoor.position.set(-0.51, -0.1, 0);
leftDoor.rotation.y = Math.PI / 2;
house.add(leftDoor);

// 마우스 클릭 이벤트 핸들러
const onMouseClick = (e) => {
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
    } else if (clickedDoor === backDoor) {
      console.log('Back Door (Autumn) clicked!');
      currentScene = fallScene;
    } else if (clickedDoor === rightDoor) {
      console.log('Right Door (Summer) clicked!');
      currentScene = summerScene;
    } else if (clickedDoor === leftDoor) {
      console.log('Left Door (Winter) clicked!');
      currentScene = winterScene;
    }
    } else {
      // 문이 아닌 곳을 클릭했을 때 homeScene으로 돌아가도록
      // currentScene = homeScene;
    }
}

window.addEventListener('click', onMouseClick);

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
