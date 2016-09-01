# A-Frame

## File format

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
