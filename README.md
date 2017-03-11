# AwayJS Materials
[![Build Status](https://travis-ci.org/awayjs/materials.svg?branch=dev)](https://travis-ci.org/awayjs/materials)

Dependency for AwayJS applications requiring a configurable method for coloring / texturing / lighting the surfaces of objects: contains data structures for a collection of material types, as well as the rendering APIs (to be moved to renderer module).

## Documentation

[Official AwayJS Documentation](https://awayjs.github.io/docs/materials)

## AwayJS Dependencies

* core
* graphics
* renderer
* scene
* stage

## Internal Structure

* data<br>
Render Data objects for storing render state for each instance of a material's methods (to be moved to renderer module)

* methods<br>
Individual material behaviours that can be strung together to confgure material properties such as specular, diffuse and shadow behaviour as well as non-lighting effects such as fog and rimlighting

* surfaces<br>
Render Data for materials and material passes (to be moved to renderer module)