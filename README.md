# A-Painter

Paint in VR in your browser. [Read more!](https://blog.mozvr.com/a-painter/)

![A-Painter logo](https://blog.mozvr.com/content/images/2016/09/logo_a-painter_high-nobrands.jpg)

## Brush API

### Brush interface
To create a new brush the following interface need to be implemented:

```javascript
BrushInterface.prototype = {
  addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {},
  tick: function (timeoffset, delta) {}
}
```

* **addPoint** (*Mandatory*): It will be called every time the brush should add a new point to the stroke. You should return `true` if you've added something to the scene, `false` otherwise. To add some mesh to the scene every brush has an injected `object3D` attribute that can be used to add children to the scene.
  * **position** (*vector3*): Controller position.
  * **orientation** (*quaternion*): Controller orientation.
  * **pointerPosition** (*vector3*): Position of the pointer where the brush should start painting.
  * **pressure** (*float[0..1]*): Trigger pressure.
  * **timestamp** (*int*): Elapsed milliseconds since the starting of a-painter.

* **tick** (*Optional*): Is called on every frame.
  * **timeoffset** (*int*): Elapsed milliseconds since the starting of a-painter.
  * **delta** (*int*): Delta time in milliseconds since the last frame.

### Common data

Every brush will have some common data injected with the following default values:
```javascript
this.data = {
  points: [],
  size: brushSize,
  prevPoint: null,
  numPoints: 0,
  maxPoints: 1000,
  color: color.clone()
};
```

* **points** (*Array of vector3*): List of control points already painted in the current stroke with this brush. (It's updated on every call to `addPoint`).
* **size** (*float*): Brush size. (It's defined when the stroke is created).
* **prevPoint** (*vector3*): The previously added point (From the last `addPoint` call).
* **numPoints** (*int*): Length of `points` array.
* **color** (*color*): Base color to be used on the brush (It's defined when the stroke is created).

### Register a new brush

To register a new brush we should call `AFRAME.registerBrush`:
```javascript
AFRAME.registerBrush(brushName, brushDefinition, options);
```

Register brush needs three parameters:
* **brushName** (*string*): The unique brush name.
* **brushDefinition** (*object*): The custom implementation of the previously defined `brushDefinition`.
* **options** (*object* [Optional]):
  * **spacing** (*float*): Minimum distance, in meters, from the previous point needed to call `addPoint`.
  * **maxPoints** (*integer*): If defined, `addPoint` won't be called after reached that number of points.

## File format

A-Painter uses the following custom binary file format to store the drawings and its strokes.

```
string magic ('apainter')
uint16 version (currently 1)
uint8 num_brushes_used
[num_brushed_used] x {
  string brush_name
}
uint32 num_strokes
[num_strokes] x {
  uint8 brush_index (Based on the previous definition order)
  float32x3 color (rgb)
  float32 size
  uint32 num_points
  [num_points] x {
    float32x3 position (vector3)
    float32x4 orientation (quaternion)
    float32 intensity
    uint32 timestamp
  }
}

string = uint8 (size) + size * uint8
```
