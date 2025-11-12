import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 기본 scene, camera, renderer 설정
const h_scr = window.innerWidth;
const v_scr = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, h_scr / v_scr, 0.1, 1000);
camera.position.z = 5;

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

// 집 (정육면체)
const houseGeometry = new THREE.BoxGeometry(1, 1, 1);
const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const house = new THREE.Mesh( houseGeometry, houseMaterial );
scene.add(house);

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


function animate() {
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
