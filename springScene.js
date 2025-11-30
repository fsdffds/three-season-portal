import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

let petals;
let petalGeometry;
const petalCount = 1000;

export function SpringScene(scene) {
  // 길
  const roadGeometry = new THREE.BoxGeometry(2, 0.05, 20);
  const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.set(0, -1, 0);
  scene.add(road);

  // 벚꽃 나무
  const treePositions = [-3, -2, -1, 0, 1, 2, 3];
  const trees = [];

  const loader = new GLTFLoader();
  loader.load(
    './assets/sakura-tree/scene.gltf',
    (gltf) => {
      for (let i = 0; i < treePositions.length; i++) {
        const tree = gltf.scene.clone();

        // 길 양 옆 위치
        const x = i % 2 === 0 ? -2 : 2;
        const z = -8 + i * 2.5;

        tree.scale.set(0.15, 0.15, 0.15);
        tree.position.set(x, -1, z);
        
        scene.add(tree);
        trees.push(tree);
      }
    },
    undefined,
    (error) => console.error(error)
  );

  // 빛
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // 벚꽃잎
  petalGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(petalCount * 3);

  // 벚꽃잎 좌표 (x, y, z)
  for (let i = 0; i < petalCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;      // x좌표
    positions[i * 3 + 1] = Math.random() * 10 + 5;      // y좌표
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;  // z좌표
  }

  petalGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const petalTexture = new THREE.TextureLoader().load('/assets/sakura-petals.png')
  const petalMaterial = new THREE.PointsMaterial({
    size: 0.2,
    map: petalTexture,
    transparent: true,
    depthWrite: false,
    color: new THREE.Color(0xFFC0CB),
  })

  petals = new THREE.Points(petalGeometry, petalMaterial);
  scene.add(petals);
}

// 벚꽃잎 애니메이션
export function petalAnimate () {
  if (!petalGeometry || !petals) return;

  const pos = petalGeometry.attributes.position;
  for (let i = 0; i < petalCount; i++) {
    pos.array[i * 3 + 1] -= 0.03;  // y축 아래로

    pos.array[i * 3] += Math.sin(Date.now() * 0.01 + i) * 0.002;
    pos.array[i * 3 + 2] += Math.cos(Date.now() * 0.001 + i) * 0.02; // 흔들림

    // 아래로 떨어지면 위로 리셋
    if (pos.array[i * 3 + 1] < -2) {
      pos.array[i * 3 + 1] = 10 + Math.random() * 5;
    }
  }
  pos.needsUpdate = true;
}