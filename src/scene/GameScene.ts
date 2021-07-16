import * as THREE from 'three';
import { eventManager, EventType } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { GameUtils } from './GameUtils';

export class GameScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private readonly objects = new Map<string, THREE.Mesh>();
  private mouseObjectId = '';
  private mousePos = new THREE.Vector3();

  constructor() {
    window.addEventListener('mousemove', this.onMouseMove);
    eventManager.registerEventListener(EventType.ADD_BEATER, this.startAddBeater);
    hotKeys.registerHotKeyListener('Escape', this.cancelAddShape);

    this.setupSceneBasics();
    this.gameLoop();
  }

  public startAddBeater = () => {
    const beaterMesh = GameUtils.createBeaterShape();
    beaterMesh.position.set(0, 0, 2);

    this.scene.add(beaterMesh);
    this.mouseObjectId = 'beater';
    this.objects.set('beater', beaterMesh);
  };

  // Create the scene, camera, renderer
  private setupSceneBasics() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
  }

  private readonly cancelAddShape = () => {
    // On escape press, stop adding a shape
    if (!this.mouseObjectId) {
      return;
    }

    const toRemove = this.objects.get(this.mouseObjectId);
    if (!toRemove) {
      return;
    }

    this.scene.remove(toRemove);
    this.mouseObjectId = '';
    eventManager.fire(EventType.CANCEL_ADD);
  };

  // ########### GAME LOOP / UPDATE ###########

  private readonly gameLoop = () => {
    requestAnimationFrame(this.gameLoop);

    this.update();

    this.renderer.render(this.scene, this.camera);
  };

  private update() {
    // If adding an object, update position of the mouse element
    if (this.mouseObjectId) {
      const mouseObj = this.objects.get(this.mouseObjectId);
      if (!mouseObj) {
        return;
      }

      mouseObj.position.set(this.mousePos.x, this.mousePos.y, 2);
    }
  }

  private readonly onMouseMove = (e: MouseEvent) => {
    // Get mouse position relative to game canvas
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    const vec = new THREE.Vector3(x, y, 0);
    vec.unproject(this.camera);
    vec.sub(this.camera.position).normalize();
    const dist = -this.camera.position.z / vec.z;
    vec.multiplyScalar(dist);
    this.mousePos = vec;
  };
}
