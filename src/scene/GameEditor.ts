import * as THREE from 'three';
import DragControls from 'drag-controls';

import { eventManager, EventType, GameEvent } from '../common/EventManager';
import { hotKeys } from '../common/HotKeys';
import { Beater } from '../common/types/shapes/Beater';
import { Shape, ShapeType } from '../common/types/shapes/Shape';
import { RandomUtils } from '../utils/RandomUtils';
import { GameScene } from './GameScene';
import { EditorUtils } from './EditorUtils';

enum EditStates {
  IDLE = 'idle',
  ADDING_SHAPE = 'adding-shape',
}

export class GameEditor {
  public shapes: Shape[] = [];
  private gameScene: GameScene;
  private editState = EditStates.IDLE;
  private mouseShape?: Shape;
  private mousePos = new THREE.Vector3();
  private selectedShape?: Shape;
  private dragControls: DragControls;
  private dragPrevPos?: THREE.Vector3;

  constructor(gameScene: GameScene) {
    this.gameScene = gameScene;

    eventManager.registerEventListener(EventType.START_ADD_SHAPE, this.startAddShape);
    eventManager.registerEventListener(EventType.DESELECT_SHAPE, this.onDeselectShape);
    eventManager.registerEventListener(EventType.REPOSITION_SHAPE, this.onChangePosition);
    eventManager.registerEventListener(EventType.SCALE_SHAPE, this.onChangeScale);

    hotKeys.registerHotKeyListener('Escape', this.cancelAddShape);
    hotKeys.registerHotKeyListener('Delete', this.deleteShape);
    hotKeys.registerHotKeyListener('Backspace', this.deleteShape);

    DragControls.install({ THREE: THREE });
    this.dragControls = new DragControls(
      [],
      this.gameScene.camera,
      this.gameScene.renderer.domElement
    );
  }

  public activate() {
    // Add listeners we need while editing
    this.addListeners();

    // Show beater directions
    const beaters = this.shapes.filter((shape) => shape.type === ShapeType.BEATER) as Beater[];
    if (beaters.length) {
      beaters.forEach((beater) => {
        beater.showDirectionLine(this.gameScene.scene);
      });
    }

    this.createDragControls();
    this.activateDragControls();
  }

  public deactivate() {
    // Remove listeners we don't need while playing
    this.removeListeners();

    // Remove beater direction lines
    const beaters = this.shapes.filter((shape) => shape.type === ShapeType.BEATER) as Beater[];
    if (beaters.length) {
      beaters.forEach((beater) => {
        beater.hideDirectionLine(this.gameScene.scene);
      });
    }

    this.disableDragControls();
  }

  public update = () => {
    // If adding an object, update position of the mouse element
    if (this.editState === EditStates.ADDING_SHAPE) {
      if (this.mouseShape) {
        // Do this 'manually' (not in shape class) to avoid computing bounding box each tick
        this.mouseShape.mesh.position.set(this.mousePos.x, this.mousePos.y, 0);
      }
    }
  };

  private addListeners() {
    this.gameScene.renderer.domElement.onclick = this.onClickCanvas;
  }

  private removeListeners() {
    this.gameScene.renderer.domElement.onclick = undefined;
  }

  private readonly startAddShape = (event: GameEvent) => {
    // Can't add multiple at once
    if (this.editState === EditStates.ADDING_SHAPE) {
      return;
    }
    // Ensures event type is correct to proceed
    if (event.e !== EventType.START_ADD_SHAPE) {
      return;
    }

    // Set mouse position via given event (avoids jumping from last known mouse pos)
    this.setMousePosition(event.mouseEvent.clientX, event.mouseEvent.clientY);

    // Start tracking mouse
    window.addEventListener('mousemove', this.onMouseMove);

    // Make the new shape
    const shape = EditorUtils.createShape(RandomUtils.createId(), event.shapeType);

    // Add to scene, save ref to object, update scene state
    shape.addToScene(this.gameScene.scene);
    this.mouseShape = shape;
    this.editState = EditStates.ADDING_SHAPE;
  };

  private readonly cancelAddShape = () => {
    if (this.editState !== EditStates.ADDING_SHAPE) {
      return;
    }

    // Stop listening to mouse movement
    window.removeEventListener('mousemove', this.onMouseMove);

    if (!this.mouseShape) {
      return;
    }

    // Remove the mouse object from the scene
    this.gameScene.scene.remove(this.mouseShape.mesh);
    // Lose ref to mouse object
    this.mouseShape = undefined;
    // Update scene state
    this.editState = EditStates.IDLE;
    // Fire cancellation event
    eventManager.fire({ e: EventType.CANCEL_ADD });
  };

  private readonly onClickCanvas = (e: MouseEvent) => {
    // Determine action based on current state
    switch (this.editState) {
      case EditStates.IDLE:
        // Set mouse position first
        this.onMouseMove(e);

        // Did user select a shape?
        const clickedShape = EditorUtils.clickedShape(this.shapes, this.mousePos);
        if (clickedShape) {
          this.selectShape(clickedShape);
        } else {
          this.deselectShape();
        }

        break;
      case EditStates.ADDING_SHAPE:
        this.addShape();
        break;
    }
  };

  private addShape() {
    if (!this.mouseShape) {
      return;
    }

    // Set the new position
    this.mouseShape.setPosition(this.mousePos);

    const valid = EditorUtils.shapePositionValid(
      this.mouseShape,
      this.gameScene.sceneLimits,
      this.shapes
    );

    if (!valid) {
      console.log('cannot place shape there!');
      return;
    }

    // If a beater, show direction line now
    if (this.mouseShape.type === ShapeType.BEATER) {
      const beater = this.mouseShape as Beater;
      beater.updateDirectionLine();
      beater.showDirectionLine(this.gameScene.scene);
    }

    // Add to shapes pool
    this.shapes.push(this.mouseShape);

    // Select it
    this.selectShape(this.mouseShape);

    // Remove reference to it, update state, fire addition event
    this.mouseShape = undefined;
    this.editState = EditStates.IDLE;
    eventManager.fire({ e: EventType.ADD_SHAPE });

    // Stop listening to mouse movement
    window.removeEventListener('mousemove', this.onMouseMove);

    // Setup drag controls for the new object
    this.createDragControls();
    this.activateDragControls();
  }

  private selectShape(shape: Shape) {
    // Ensure we didn't re-select same shape
    if (shape.id === this.selectedShape?.id) {
      return;
    }

    this.deselectShape();

    this.selectedShape = shape;

    this.selectedShape.showOutline(this.gameScene.scene);

    eventManager.fire({ e: EventType.SELECT_SHAPE, shape });
  }

  private readonly onDeselectShape = (_event: GameEvent) => {
    this.deselectShape();
  };

  private deselectShape() {
    if (this.selectedShape) {
      this.selectedShape.hideOutline(this.gameScene.scene);
      this.selectedShape = undefined;
      eventManager.fire({ e: EventType.DESELECT_SHAPE });
    }
  }

  private readonly deleteShape = () => {
    if (this.selectedShape) {
      this.selectedShape.removeFromScene(this.gameScene.scene);
      this.shapes = this.shapes.filter((shape) => shape.id !== this.selectedShape.id);
      this.selectedShape = undefined;
    }
  };

  private readonly onChangePosition = (event: GameEvent) => {
    if (event.e !== EventType.REPOSITION_SHAPE || !this.selectedShape) {
      return;
    }

    const newPos = event.newPos;
    const oldPos = new THREE.Vector3().copy(this.selectedShape.mesh.position);

    // First, move shape to new position
    this.selectedShape.setPosition(newPos);

    // Then check that position is valid for that shape to be in
    const valid = EditorUtils.shapePositionValid(
      this.selectedShape,
      this.gameScene.sceneLimits,
      this.shapes
    );

    if (!valid) {
      console.log('invalid position!');
      this.selectedShape.setPosition(oldPos);
    }
  };

  private readonly onChangeScale = (event: GameEvent) => {
    if (event.e !== EventType.SCALE_SHAPE || !this.selectedShape) {
      return;
    }

    const newScale = event.scale;
    const oldScale = this.selectedShape.scale;

    // Set to new scale
    this.selectedShape.setScale(newScale);

    // Check it is still in bounds/not colliding
    const valid = EditorUtils.shapePositionValid(
      this.selectedShape,
      this.gameScene.sceneLimits,
      this.shapes
    );

    // If invalid, revert scale
    if (!valid) {
      console.log('invalid scale');
      this.selectedShape.setScale(oldScale);
    }
  };

  private readonly onMouseMove = (e: MouseEvent) => {
    this.setMousePosition(e.clientX, e.clientY);
  };

  private setMousePosition(mouseX: number, mouseY: number) {
    // Get mouse position relative to game canvas
    const x = (mouseX / window.innerWidth) * 2 - 1;
    const y = -(mouseY / window.innerHeight) * 2 + 1;
    const vec = new THREE.Vector3(x, y, 0);
    vec.unproject(this.gameScene.camera);
    vec.sub(this.gameScene.camera.position).normalize();
    const dist = -this.gameScene.camera.position.z / vec.z;
    vec.multiplyScalar(dist);
    vec.z = 0;
    this.mousePos = vec;
  }

  private createDragControls() {
    if (this.shapes.length) {
      const dragObjects = this.shapes.map((shape) => shape.mesh);
      this.dragControls = new DragControls(
        dragObjects,
        this.gameScene.camera,
        this.gameScene.renderer.domElement
      );
    }
  }

  private activateDragControls() {
    this.dragControls.addEventListener('dragstart', this.onDragStart);
    this.dragControls.addEventListener('drag', this.onDrag);
    this.dragControls.addEventListener('dragend', this.onDragEnd);

    // Highlight on hover - not firing
    // this.dragControls.addEventListener('hoveron', (e) => {
    //   //console.log('hover', e);
    // });
  }

  private readonly onDragStart = (e: THREE.Event) => {
    if (e.object) {
      // Find shape being dragged
      const id = e.object.name;
      const shape = this.shapes.find((shape) => shape.id === id);
      if (shape) {
        // Select shape
        this.selectShape(shape);
        // Save current position to revert to later if movement invalid
        this.dragPrevPos = new THREE.Vector3().copy(shape.mesh.position);
      }
    }
  };

  private readonly onDrag = (e: THREE.Event) => {
    if (e.object && this.selectedShape) {
      this.selectedShape.setPosition(e.object.position);
    }
    this.gameScene.renderer.render(this.gameScene.scene, this.gameScene.camera);
  };

  private readonly onDragEnd = (e: THREE.Event) => {
    if (e.object && this.selectedShape) {
      // Check object's new position is valid
      const valid = EditorUtils.shapePositionValid(
        this.selectedShape,
        this.gameScene.sceneLimits,
        this.shapes
      );
      if (!valid && this.dragPrevPos) {
        // Revert to previous position
        this.selectedShape.setPosition(this.dragPrevPos);
      }
    }
  };

  private disableDragControls() {
    if (!this.dragControls) {
      return;
    }

    this.dragControls.deactivate();
  }
}
