import * as THREE from 'three';

import { eventManager, EventType, GameEvent } from '../../common/EventManager';
import { hotKeys } from '../../common/HotKeys';
import { Beater } from '../../common/types/shapes/Beater';
import { Shape, ShapeType } from '../../common/types/shapes/Shape';
import { RandomUtils } from '../../utils/RandomUtils';
import { EditorUtils } from './EditorUtils';
import { GameScene } from '../GameScene';

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
  private dragStartPos = new THREE.Vector3();
  private dragOffset = new THREE.Vector3();

  constructor(gameScene: GameScene) {
    this.gameScene = gameScene;

    eventManager.registerEventListener(EventType.START_ADD_SHAPE, this.startAddShape);
    eventManager.registerEventListener(EventType.DESELECT_SHAPE, this.onDeselectShape);
    eventManager.registerEventListener(EventType.REPOSITION_SHAPE, this.onChangePosition);
    eventManager.registerEventListener(EventType.SCALE_SHAPE, this.onChangeScale);
    eventManager.registerEventListener(EventType.DELETE_SHAPE, this.deleteShape);

    hotKeys.registerHotKeyListener('Escape', this.cancelAddShape);
    hotKeys.registerHotKeyListener('Delete', this.deleteShape);
  }

  public activate() {
    this.addListeners();

    // Show beater directions
    const beaters = this.shapes.filter((shape) => shape.type === ShapeType.BEATER) as Beater[];
    if (beaters.length) {
      beaters.forEach((beater) => {
        beater.showDirectionLine(this.gameScene.scene);
      });
    }
  }

  public deactivate() {
    this.removeListeners();

    // Remove beater direction lines
    const beaters = this.shapes.filter((shape) => shape.type === ShapeType.BEATER) as Beater[];
    if (beaters.length) {
      beaters.forEach((beater) => {
        beater.hideDirectionLine(this.gameScene.scene);
      });
    }
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
    this.gameScene.renderer.domElement.addEventListener('mousedown', this.onClickCanvas);
  }

  private removeListeners() {
    this.gameScene.renderer.domElement.removeEventListener('mousedown', this.onClickCanvas);
  }

  private trackMouse() {
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private untrackMouse() {
    window.removeEventListener('mousemove', this.onMouseMove);
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
    this.trackMouse();

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
    this.untrackMouse();

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
          this.onDragStart();
        } else {
          this.deselectShape();
        }

        break;
      case EditStates.ADDING_SHAPE:
        this.addShape();
        break;
    }
  };

  private onDragStart() {
    // Save the current shape's position before the drag started
    this.dragStartPos = this.dragStartPos.copy(this.selectedShape.mesh.position);

    // Work out the offset from mouse to shape
    this.dragOffset = EditorUtils.getMouseOffset(this.selectedShape, this.mousePos);

    // Track mouse position
    this.trackMouse();

    // Additional mouse move callback to set shape position
    document.addEventListener('mousemove', this.onDrag);

    // Listen for mouse up to signify drag ended
    document.addEventListener('mouseup', this.onDragEnd);
  }

  private readonly onDrag = () => {
    // Move the selected shape
    const offsetPos = new THREE.Vector3().copy(this.mousePos).sub(this.dragOffset);
    this.selectedShape.setPosition(offsetPos);
  };

  private readonly onDragEnd = () => {
    // Is this shape's new position valid?
    const valid = EditorUtils.shapePositionValid(
      this.selectedShape,
      this.gameScene.sceneLimits,
      this.shapes
    );
    if (!valid) {
      // Move it back to before drag started
      this.selectedShape.setPosition(this.dragStartPos);
    }

    // Can now stop tracking mouse and mouseup
    this.untrackMouse();
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('mousemove', this.onDrag);
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
    this.untrackMouse();
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

  private readonly deleteShape = (event?: GameEvent) => {
    if (this.selectedShape) {
      this.selectedShape.removeFromScene(this.gameScene.scene);
      this.shapes = this.shapes.filter((shape) => shape.id !== this.selectedShape.id);
      this.selectedShape = undefined;
      eventManager.fire({ e: EventType.DELETE_SHAPE });
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
}
