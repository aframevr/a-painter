# A-Painter

Paint in VR in your browser. [Read more!](https://blog.mozvr.com/a-painter/)

[![A-Painter logo](https://blog.mozvr.com/content/images/2016/09/logo_a-painter_high-nobrands.jpg)](https://blog.mozvr.com/a-painter/)

[VIEW GALLERY](https://github.com/aframevr/a-painter/issues/99)

## Usage

- Grab a [WebXR-enabled browser](https://immersiveweb.dev/).
- Head to [https://aframe.io/a-painter/](https://aframe.io/a-painter/) and start painting. See the [blog post](https://blog.mozvr.com/a-painter/) for some instructions.
- Painted something beautiful? Share it on [this GitHub issue](https://github.com/aframevr/a-painter/issues/99)!

## Local Development

```bash
git clone git@github.com:aframevr/a-painter && cd a-painter
npm install
npm start
```

Then, load [`http://localhost:8080`](http://localhost:8080) in your browser.

## URL parameters

- **url** (url) Loads a painting in apa format
- **urljson** (url) Loads a painting in json format
- **sky** (image url) Changes the sky texture (empty to remove sky)
- **floor** (image url) Changes the floor texture (empty to remove)
- **bgcolor** (Hex color without the #) Background color

Example: [https://aframe.io/a-painter/?sky=&floor=http://i.imgur.com/w9BylL0.jpg&bgcolor=24caff&url=https://ucarecdn.com/0b45b93b-e651-42d8-ba49-b2df907575f3/](https://aframe.io/a-painter/?sky=&floor=http://i.imgur.com/w9BylL0.jpg&bgcolor=24caff&url=https://ucarecdn.com/0b45b93b-e651-42d8-ba49-b2df907575f3/)

## Brush API

### Brush Interface

To create a new brush, implement the following interface:

```javascript
BrushInterface.prototype = {
  init: function () {},
  addPoint: function (position, orientation, pointerPosition, pressure, timestamp) {},
  tick: function (timeOffset, delta) {}
};
```

- **init** (): Use this for initializing variables, materials, etc. for your brush.

- **addPoint** (*Mandatory*): It will be called every time the brush should add a new point to the stroke. You should return `true` if you've added something to the scene and `false` otherwise. To add some mesh to the scene, every brush has an injected `object3D` attribute that can be used to add children to the scene.
  - **position** (*vector3*): Controller position.
  - **orientation** (*quaternion*): Controller orientation.
  - **pointerPosition** (*vector3*): Position of the pointer where the brush should start painting.
  - **pressure** (*float[0..1]*): Trigger pressure.
  - **timestamp** (*int*): Elapsed milliseconds since the starting of A-Painter.

- **tick** (*Optional*): Is called on every frame.
  - **timeOffset** (*int*): Elapsed milliseconds since the starting of A-Painter.
  - **delta** (*int*): Delta time in milliseconds since the last frame.

*Development Tip*: set your brush as the default brush at the top of
`src/components/brush.js` (`brush: {default: 'yourbrush'}`) while developing so
you don't have to re-select it every time you reload.

### Common Data

Every brush will have some common data injected with the following default values:

```javascript
this.data = {
  points: [],
  size: brushSize,
  prevPosition: null,
  prevPointerPosition: null,
  numPoints: 0,
  maxPoints: 1000,
  color: color.clone()
};
```

- **points** (*Array of vector3*): List of control points already painted in the current stroke with this brush. (It's updated on every call to `addPoint`.)
- **size** (*float*): Brush size. (It's defined when the stroke is created.)
- **prevPosition** (*vector3*): The latest controller position (from the last `addPoint` call).
- **prevPointerPosition** (*vector3*): The latest pointer position (from the last `addPoint` call).
- **numPoints** (*int*): Length of `points` array.
- **color** (*color*): Base color to be used on the brush. (It's defined when the stroke is created.)

### Registering a New Brush

To register a new brush we should call `AFRAME.registerBrush`:

```javascript
AFRAME.registerBrush(brushName, brushDefinition, options);
```

Register brush needs three parameters:

- **brushName** (*string*): The unique brush name.
- **brushDefinition** (*object*): The custom implementation of the previously defined `brushDefinition`.
- **options** (*object* [Optional]):
  - **thumbnail** (*string*): Path to the thumbnail image file.
  - **spacing** (*float*): Minimum distance, in meters, from the previous point needed to call `addPoint`.
  - **maxPoints** (*integer*): If defined, `addPoint` won't be called after reaching that number of points.

## File Format

A-Painter uses the following custom binary file format to store the drawings and its strokes.

```text
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
