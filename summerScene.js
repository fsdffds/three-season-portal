import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export function SummerScene(scene) {
  // 전체 크기 설정
  const planeSize = 10;
  const halfSize = planeSize / 2;
  
  const thickness = 1.5;

  // 모래사장
  const sandGeometry = new THREE.BoxGeometry(7, thickness, planeSize, 20, 1, 20);
  
  const sandMaterial = new THREE.MeshStandardMaterial({
    color: 0xedcdaf,
    flatShading: true,
  });
  
  // 울퉁불퉁하게
  const sandPos = sandGeometry.attributes.position;

  for (let i = 0; i < sandPos.count; i++) {
    const y = sandPos.getY(i);

    if (y > 0) { 
      sandPos.setY(i, y + (Math.random() - 0.5) * 0.3);
    }
  }
  // 그림자 다시 계산
  sandGeometry.computeVertexNormals();

  const sand = new THREE.Mesh(sandGeometry, sandMaterial);

  sand.position.set(-halfSize / 2, -thickness / 2, 0);
  scene.add(sand);

  sand.receiveShadow = true;

  // 야자 나무
  const loader = new GLTFLoader();
  loader.load(
    './assets/palm_tree.glb',
    (gltf) => {
      const tree1 = gltf.scene;

      tree1.scale.set(0.8, 0.8, 0.8);
      tree1.position.set(-5, 0, 4);
      scene.add(tree1);

      tree1.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

      const tree2 = tree1.clone();

      tree2.scale.set(0.6, 0.6, 0.8);
      tree2.position.set(-4.4, 0, 3);
      scene.add(tree2);
  }, undefined, 
  (error) => console.error(error)
);

  // 조개껍데기
  loader.load(
    './assets/seashell.glb',
    (gltf) => {
      const seashell1 = gltf.scene;

      seashell1.scale.set(0.2, 0.2, 0.2);
      seashell1.position.set(-2, 0.03, 3);
      seashell1.rotation.x = - Math.PI / 2;

      seashell1.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(seashell1);

    const seashell2 = seashell1.clone();

    seashell2.scale.set(0.2, 0.2, 0.2);
    seashell2.position.set(-1, 0.03, -2);
    seashell2.rotation.x = - Math.PI / 2;
    scene.add(seashell2);
    }, undefined, 
  (error) => console.error(error)
);

  // 비치볼
  loader.load(
    './assets/beach_ball.glb',
    (gltf) => {
      const ball = gltf.scene;

      ball.scale.set(0.2, 0.2, 0.2);
      ball.position.set(-4, 0.2, 3.5);
      ball.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
      scene.add(ball);
    }, undefined, 
  (error) => console.error(error)
);

  // 의자
  loader.load(
    './assets/deck_chair.glb',
    (gltf) => {
      const chair1 = gltf.scene;

      chair1.scale.set(2, 2, 2);
      chair1.position.set(-4, 0, -1);
      scene.add(chair1);

      chair1.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

      const chair2 = chair1.clone();

      chair2.scale.set(2, 2, 2);
      chair2.position.set(-4, 0, 0);
      scene.add(chair2);
    }, undefined, 
  (error) => console.error(error)
);

  // 집
  loader.load(
    './assets/summer_house.glb',
    (gltf) => {
      const house = gltf.scene;

      house.scale.set(0.015, 0.015, 0.015);
      house.position.set(-4, 0, -3);

      house.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

      scene.add(house);
    }, undefined, 
  (error) => console.error(error)
);

  // 바다 
  const waterGeometry = new THREE.BoxGeometry(3, thickness, planeSize, 15, 1, 15);
  
  const waterMaterial = new THREE.MeshPhongMaterial({
    color: 0x6aaed6,
    shininess: 150,
    flatShading: true,
    transparent: true,
    opacity: 0.9,
  });

  // 파도
  const waterPos = waterGeometry.attributes.position;

  for (let i = 0; i < waterPos.count; i++) {
    const y = waterPos.getY(i);

    if (y > 0) {
      const x = waterPos.getX(i);
      const z = waterPos.getZ(i);
      const waveHeight = Math.sin(x * 1.6) * Math.cos(z * 1.6) * 0.2;
      waterPos.setY(i, y + waveHeight);
    }
  }
  waterGeometry.computeVertexNormals();

  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.position.set(halfSize / 2, -thickness / 2, 0);
  scene.add(water);

  // 바위
  const rockGeometry = new THREE.DodecahedronGeometry(0.5, 0);
  const rockMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    flatShading: true,
  })
  const rock1 = new THREE.Mesh(rockGeometry, rockMaterial);

  rock1.position.set(3, 0.05, 2);
  rock1.scale.set(1.5, 1.2, 1.2);
  rock1.castShadow = true;
  rock1.receiveShadow = true;
  scene.add(rock1);

  const rock2 = new THREE.Mesh(rockGeometry, rockMaterial);

  rock2.position.set(1.5, 0.05, -0.5);
  rock2.scale.set(0.9, 0.8, 1.0);
  rock2.castShadow = true;
  rock2.receiveShadow = true;
  scene.add(rock2);

  // 조명
  const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
  sunLight.position.set(10, 20, 10);
  sunLight.castShadow = true; 
  scene.add(sunLight);

  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -15;
  sunLight.shadow.camera.right = 15;
  sunLight.shadow.camera.top = 15;
  sunLight.shadow.camera.bottom = -15;
  
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);
}