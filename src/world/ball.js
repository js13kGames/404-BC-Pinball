import { Shape } from "../math/shape.js";
import { Vector } from "../math/vector.js";
import { Body } from "../physic/body.js";
import { Settings } from "../settings.js";
import { Assets } from "../assets.js";

export class Ball {
    constructor() {
        this.initialPosition = Assets['ball.collider'].vertices[0];
        this.body = new Body(Settings.ballMass);
        this.body.shape = Assets['ball.collider'];
        this.body.position = this.initialPosition;
        this.body.bounciness = Settings.ballBounciness;
        this.body.applyField(new Vector(0, this.body.mass * Settings.gravity));
        this.sprite = Assets.ball;
    }

    update(delta) {
        this.body.update(delta);
        if (this.body.position.y > Settings.height) {
            this.body.translate(this.initialPosition.subtract(this.body.position));
        }
    }

    render(delta, context) {
        if (Settings.debug) {
            Shape.debugDraw(this.body.shape, context);
        } else {
            Shape.debugDraw(this.body.shape, context);
            // context.drawImage(this.sprite, this.body.position.x, this.body.position.y);
        }
    }
}