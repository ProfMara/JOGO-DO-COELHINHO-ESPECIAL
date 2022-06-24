const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var solo;
var fruta, corda1, corda2;
var con1, con2;
var botao1, botao2;

var cenarioIMG, frutaIMG, coelhoIMG, coelho;

var piscar, triste, comer;

var botaoVentilador;

var balao, starImg, star, stars, star0, star1, star2;

var starS, starS1;

function preload() {

    cenarioIMG = loadImage("background.png");
    frutaIMG = loadImage("melon.png");
    coelhoIMG = loadImage("Rabbit-01.png");

    piscar = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
    triste = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
    comer = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png")
    piscar.playing = true;
    triste.playing = true;
    triste.looping = false;
    comer.playing = true;
    comer.looping = false;

    somCorte = loadSound("rope_cut.mp3");
    somComendo = loadSound("eating_sound.mp3");
    somFundo = loadSound("sound1.mp3");
    somAr = loadSound("Cutting Through Foliage.mp3")
    
    //imagem da estrela
    starImg = loadImage("estrela.png");

    //imagem dos placares
    placar0 = loadImage("vazio.png");
    placar1 = loadImage("uma_estrela.png");
    placar2 = loadImage("duas_estrelas.png");

}


function setup() {
    createCanvas(500, 700);
    frameRate(80);
    somFundo.play();
    somFundo.setVolume(0.1);

    botao1 = createImg("cut_btn.png");
    botao1.position(400, 75);
    botao1.size(50, 50);
    botao1.mouseClicked(soltar1);

    botao2 = createImg("cut_btn.png");
    botao2.position(40, 75);
    botao2.size(50, 50);
    botao2.mouseClicked(soltar2);

    balao = createImg("balloon.png");
    balao.position(245, 400);
    balao.size(120, 120);
    balao.mouseClicked(soprar);

    botaoVolume = createImg("mute.png");
    botaoVolume.position(300, 25);
    botaoVolume.size(50, 50);
    botaoVolume.mouseClicked(pausar);



    engine = Engine.create();
    world = engine.world;
    solo = new Ground(200, 690, 600, 20);
    corda1 = new Rope(7, { x: 400, y: 75 });
    corda2 = new Rope(7, { x: 40, y: 75 });


    fruta = Bodies.circle(250, 300, 20);
    Matter.Composite.add(corda1.body, fruta);

    con1 = new Link(corda1, fruta);
    con2 = new Link(corda2, fruta);

    piscar.frameDelay = 20;
    comer.frameDelay = 20;
    triste.frameDelay = 20;

    coelho = createSprite(220, 650, 50, 50);
    coelho.addImage(coelhoIMG);
    coelho.addAnimation("chorando", triste);
    coelho.addAnimation("piscando", piscar);
    coelho.addAnimation("comendo", comer);
    coelho.scale = 0.15;
    coelho.changeAnimation("piscando");

    //placar
    placar = createSprite(70, 30);
    //adicionando as 3 diferentes animações do placar
    
    
    
    //mudar a imagem do placar para 0
    
    
    placar.scale = 0.25;

    star1 = createSprite(250, 35, 30, 30);
    star1.addImage(starImg);
    star1.scale = 0.025;

    star2 = createSprite(35, 335, 30, 30);
    star2.addImage(starImg);
    star2.scale = 0.025;

    rectMode(CENTER);
    ellipseMode(RADIUS);

}

function draw() {
    image(cenarioIMG, 0, 0, width, height);
    corda1.show();
    corda2.show();

    imageMode(CENTER);

    Engine.update(engine);
    solo.show();

    if (fruta !== null) {
        image(frutaIMG, fruta.position.x, fruta.position.y, 60, 60);
    }

    if (collide(fruta, coelho)) {
        coelho.changeAnimation("comendo");
        somComendo.play();
    }
    //código para verificar se ambas as sprites estão invisíveis, se sim, mudar imagem do placar para 2


    //se alguma das duas sprites estiver invisível, mudar o placar para 1

    
    //código que verifica se a fruta está tocando nas sprites



    if (collide(fruta, solo.body)) {
        coelho.changeAnimation("chorando");
        somFundo.stop();
    }

    drawSprites();

}

function soltar1() {
    corda1.break();
    con1.detach();
    con1 = null;
    somCorte.play();
}

function soltar2() {
    corda2.break();
    con2.detach();
    con2 = null;
    somCorte.play();
}


function collide(body, sprite) {

    if (body != null) {
        var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
        if (d <= 80) {
            World.remove(engine.world, fruta);
            fruta = null;
            return true;
        } else {
            return false;
        }
    }
}

//função que verifica se há o toque na sprite, se sim, ela fica invisível


         


function pausar() {

    if (somFundo.isPlaying()) {
        somFundo.stop();

    } else {
        somFundo.play();
        somFundo.setVolume(0.1);
    }
}

function soprar() {
    Body.applyForce(fruta, { x: 0, y: 0 }, { x: 0, y: -0.03 })
    somAr.play();
}