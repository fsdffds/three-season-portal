import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

let petals;
let petalGeometry;
const petalCount = 1000;

export function SpringScene(scene) {
  const textureLoader = new THREE.TextureLoader();
  const loader = new GLTFLoader();

  // 기본 바닥
  const groundGeometry = new THREE.BoxGeometry(10, 1, 10);
  const grassTexture = textureLoader.load('./assets/texture/grass.jpg');
  const groundMaterial = new THREE.MeshStandardMaterial({
    roughness: 1.0,
    flatShading: true,
    map: grassTexture
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  scene.add(ground);

  // 길
  const roadGeometry = new THREE.BoxGeometry(10, 0.05, 3);
  const roadMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x444444,
    roughness: 0.8,
  });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.receiveShadow = true;
  scene.add(road);

  // 벚꽃 나무
  loader.load(
    './assets/sakura-tree/scene.gltf',
    (gltf) => {
      const originalTree = gltf.scene;
      originalTree.scale.set(0.15, 0.2, 0.15);
      originalTree.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      const sideZ = [3.2, -3.2];

      const startX = -4;
      const endX = 4;
      const stepX = 2;

      sideZ.forEach((z) => {
        for (let x = startX; x <= endX; x += stepX) {
          const tree = originalTree.clone();
          tree.position.set(x, 0, z);

          tree.rotation.y = Math.random() * Math.PI * 2;
          scene.add(tree);
        }
      });
    }, undefined,
    (error) => console.error(error)
  );

  // 빛
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(2048, 2048);
  scene.add(directionalLight);

  // 벚꽃잎
  petalGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(petalCount * 3);

  // 벚꽃잎 좌표 (x, y, z)
  for (let i = 0; i < petalCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;      // x좌표
    positions[i * 3 + 1] = Math.random() * 10 + 2;      // y좌표
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;  // z좌표
  }

  petalGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const petalTexture = textureLoader.load('/assets/texture/sakura-petals.png')
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
    pos.array[i * 3 + 1] -= 0.03; // y축 아래로

    pos.array[i * 3] += Math.sin(Date.now() * 0.01 + i) * 0.002;
    pos.array[i * 3 + 2] += Math.cos(Date.now() * 0.001 + i) * 0.02; // 흔들림

    // 아래로 떨어지면 위로 리셋
    if (pos.array[i * 3 + 1] < 0) {
      pos.array[i * 3 + 1] = 7 + Math.random() * 3;
    }
  }
  pos.needsUpdate = true;
}
