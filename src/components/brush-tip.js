AFRAME.registerComponent('brush-tip', {
  schema: {
    controller: { type: 'string' },
    hand: { 
      type: 'string',
      oneOf: ['left', 'right']
    }
  },

  init: function () {
    var toRad = degrees => THREE.MathUtils.degToRad(degrees);
    
    this.controllers = {
      'oculus-touch-controller-v3': {
        left: {
          positionOffset: { x: 0, y: -0.025, z: -0.042 },
          rotationOffset: { x: toRad(-45), y: toRad(7), z: toRad(-7) }
        },
        right: {
          positionOffset: { x: 0, y: -0.025, z: -0.042 },
          rotationOffset: { x: toRad(-45), y: toRad(-7), z: toRad(7) }
        }
      }
    };

    if (this.data.controller) {
      this.setController(this.data.controller, this.data.hand);
    }
  },

  setController: function (controller, hand) {
    if (controller in this.controllers) {
      this.el.object3D.position.set(
        this.controllers[controller][hand].positionOffset.x,
        this.controllers[controller][hand].positionOffset.y,
        this.controllers[controller][hand].positionOffset.z
      );
      this.el.object3D.rotation.set(
        this.controllers[controller][hand].rotationOffset.x,
        this.controllers[controller][hand].rotationOffset.y,
        this.controllers[controller][hand].rotationOffset.z
      )
    } else {
      console.error(`${controller} is not present in the controllers list!`);
    }
  }
});
