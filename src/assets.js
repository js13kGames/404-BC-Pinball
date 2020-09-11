import { Shape } from './math/shape.js';

class AssetsImpl {

    constructor(){
      this.atlas = null;
      this.sprites = {};
      this.colliders = {};
      this.fxs = {};
    }

    loadSvg(svg, onload) {
        const b64 = `data:image/svg+xml;base64,${btoa(svg.outerHTML)}`;
        const image = new Image();
        image.onload = () => {
            this.atlas = image;
            onload();
        };
        image.src = b64;
    }

    load(svg, onload) {
        for (const node of svg.getElementById("$layer2").querySelectorAll("*")) {
            const d = node.getAttribute("d");
            const atlas = svg.getElementById(node.id.replace(/(.[0-9])?.collider/g, ""));
            const bBox = atlas != undefined ? atlas.getBBox() : node.getBBox();
            this.colliders[node.id.substring(1)] = Shape.fromSvgData(d, bBox);
        }
        for (const node of svg.getElementById("$layer1").querySelectorAll("*")) {
            if (node.getBBox) this.sprites[node.id.substring(1)] = node.getBBox();
            if (node.id.endsWith(".fx")) this.fxs[node.id.substring(1)] = new Path2D(node.getAttribute("d"));
        }
        document.getElementById("$layer2").style.display = "none";
        this.loadSvg(svg, () => {
            onload();
            svg.style.display = "none";
        });
    }
}

export const Assets = new AssetsImpl();
