import Phaser from "phaser";

import battleTheme from "./audio/battleTheme.mp3";

import wizardSprite from "./images/wizard_sprite-0.png";
import wizardSpriteJson from "./images/wizard_sprite.json";

const config = {
  type: Phaser.AUTO,
  // width: 800,
  // height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2000 }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

/* eslint-disable no-unused-vars */
const game = new Phaser.Game(config);
let player;
let cursors;
let jumpButton;
let attackButton;
let music;

function preload() {
  this.load.atlas("wizard", wizardSprite, wizardSpriteJson);
  this.load.audio("battleTheme", [battleTheme]);
}

function create() {
  music = this.sound.add("battleTheme", { loop: true });
  music.play();

  const platforms = this.physics.add.staticGroup();
  platforms.enableBody = true;

  player = this.physics.add
    .sprite(400, 600, "wizard", "wizard/idle/idle_1")
    .setScale(0.15);

  createAnimations(this, [
    {
      key: "idle",
      length: 4
    },
    {
      key: "attack",
      length: 3
    },
    {
      key: "walk",
      length: 4
    },
    {
      key: "jump",
      length: 3
    }
  ]);

  // Collide with platforms
  this.physics.add.collider(player, platforms);

  player.setBounce(0);
  player.setOrigin(0.5, 1);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(1);

  cursors = this.input.keyboard.createCursorKeys();
  jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  attackButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
}

function update() {
  if (attackButton.isDown) {
    player.play("attack", true);
    return;
  }

  if (cursors.left.isDown) {
    player.body.velocity.x = -160;
    player.play("walk", true);
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 160;
    player.play("walk", true);
  } else {
    player.setVelocityX(0);
  }

  if ((cursors.up.isDown || jumpButton.isDown) && player.body.onFloor()) {
    player.body.velocity.y = -600;
    player.play("jump", true);
  } else if (
    player.body.velocity.x === 0 &&
    player.body.onFloor() &&
    !attackButton.isDown
  ) {
    player.play("idle", true);
  }
}

function createAnimations(scene, actions) {
  actions.map(({ key, length }) =>
    scene.anims.create({
      key,
      frames: scene.anims.generateFrameNames("wizard", {
        prefix: `wizard/${key}/${key}_`,
        start: 1,
        end: length
      }),
      frameRate: length
    })
  );
}
