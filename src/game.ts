import { Settings } from "./settings";
import { World } from "./world/world";
import { CanvasContext } from "./canvasContext";

export class Game {
    tickLength: number;
    lastTick: number;
    lastRender: number;
    dynamicCanvas: HTMLCanvasElement;
    hybridCanvas: HTMLCanvasElement;
    staticCanvas: HTMLCanvasElement;
    context: CanvasContext;
    world: World;

    constructor() {
        this.tickLength = Settings.engineTimeResolution;
        this.lastTick = performance.now();
        this.lastRender = this.lastTick;
        this.dynamicCanvas = document.getElementById("dynamic-canvas") as HTMLCanvasElement;
        this.hybridCanvas = document.getElementById("hybrid-canvas") as HTMLCanvasElement;
        this.staticCanvas = document.getElementById("static-canvas") as HTMLCanvasElement;
        this.context = new CanvasContext(
            this.staticCanvas.getContext("2d"),
            this.hybridCanvas.getContext("2d"),
            this.dynamicCanvas.getContext("2d")
        );
        this.world = new World();
    }

    loop(tFrame: number) {
        window.requestAnimationFrame(t => this.loop(t));
        var nextTick = this.lastTick + this.tickLength;
        var numTicks = 0;

        if (tFrame > nextTick) {
            var elapsed = tFrame - this.lastTick;
            numTicks = Math.floor(elapsed / this.tickLength);
        }
        
        this.queueUpdates(numTicks);
        this.render();
        this.lastRender = tFrame;
    }

    queueUpdates(numTicks: number) {
        for (var i = 0; i < numTicks; i++) {
            this.lastTick += this.tickLength;
            this.update(this.tickLength / 1000);
        }
    }

    update(delta: number) {
        this.world.update(delta);
    }

    render() {
        this.world.render(this.context);
    }
}