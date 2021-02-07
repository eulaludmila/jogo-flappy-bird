const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';
const sprites = new Image();
sprites.src = './sprites.png';

let frames = 0
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [Plano de Fundo]
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        //Pegar o quadrado e colocar a cor
        contexto.fillStyle = '#70c5ce';
        //Vai pintar de lado a lado
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
};

// [Chao]
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        //moviemtanção do chão
        atualiza() {
            const movimentoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoChao;

            // console.log('[chao.x]', chao.x);
            // console.log('[repeteEm]', repeteEm);
            // console.log('[movimentacao]', movimentacao % repeteEm);

            chao.x = movimentacao % repeteEm;


        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );

            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
    };

    return chao;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}

function criaFlappyBird() {

    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 5,
        pula() {
            console.log('pula');
            console.log('[antes]', flappyBird.velocidade);

            //dimuindo a velocidade, logo está subindo
            flappyBird.velocidade = - flappyBird.pulo;
            console.log('[depois]', flappyBird.velocidade);
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {

            if (fazColisao(flappyBird, globais.chao)) {
                console.log('fez colisao');
                som_HIT.play();
                mudaParaTela(Telas.GAME_OVER);
                return;
            }

            //aumentando a velocidade
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
        ],

        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloFrames = 10;
            let passouIntervalo = frames % intervaloFrames === 0;

            if (passouIntervalo) {
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
            // console.log('[incremento]', incremento);
            // console.log('[baseRepetição]', baseRepeticao);
            // console.log('[frame]', flappyBird.frameAtual);
        },
        desenha() {
            flappyBird.atualizaFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY, //Sprite X e Y
                flappyBird.largura, flappyBird.altura, //Tamanho do recorte da sprite
                flappyBird.x, flappyBird.y, //Posição dentro do canvas
                33, 24 //Tamanho da imagem no canvas
            );
        }

    }

    return flappyBird;
}

// [Canos]
// 

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
            canos.pares.forEach((par) => {
                const yRandom = par.y;
                const espacamentoEntreCanos = 120;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;


                // [Cano do Céu]
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )

                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;

                // [Cano do Chão]
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY,
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                }
            })


        },
        temColisaoFlappyBird(par){

            const cabecaDoFlappy =  globais.flappyBird.y;
            const peDoFlappy =  globais.flappyBird.y + globais.flappyBird.altura;

            if((globais.flappyBird.x + globais.flappyBird.largura - 4) >= par.x){

                //Verificando se o flappy bate na cabeça do cano
                if(cabecaDoFlappy <= par.canoCeu.y){
                    return true;
                }
                
                //Verificando se o flappy bate na iparte de cima do cano
                if(peDoFlappy >= par.canoChao.y){
                    return true;

                }
            }

            return false;
        },
        pares: [],
        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if (passou100Frames) {
                canos.pares.push({
                    x: canvas.height,
                    y: -180 * (Math.random() + 1),
                })
            }

            canos.pares.forEach((par) => {
                par.x = par.x - 2;

                if(canos.temColisaoFlappyBird(par)) {
                    som_HIT.play();
                    mudaParaTela(Telas.GAME_OVER);
                }

                if(par.x  + canos.largura <= 0){
                    canos.pares.shift();
                }
            })
        }

    }

    return canos;
}


/// [mensagemGetReady]
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    }
}

/// [mensagemGameOver]
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGameOver.sX, mensagemGameOver.sY,
            mensagemGameOver.w, mensagemGameOver.h,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.w, mensagemGameOver.h
        );

    }
}


let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}


function criaPlacar(){
    const placar = {
        pontuacao:0,
        desenha(){
            contexto.font = '30px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`Pontuação: ${placar.pontuacao}`,canvas.width - 10,35)
        },
        atualiza(){
            const intervaloFrames = 25;
            let passouIntervalo = frames % intervaloFrames === 0;

            if(passouIntervalo){
                placar.pontuacao ++;
                pontuacao = placar.pontuacao;
                console.log(pontuacao);
            }
                
        },
    }

    return placar;
}

function criaScorePlacar(){
    // console.log(pontuacao);
    const score = {
        desenha(){
            contexto.font = '30px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'black';
            contexto.fillText(`${pontuacao}`,240, 145)
            
        }
    }

    return score;
}

// [Telas]

const globais = {}
const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
}

Telas.JOGO = {
    inicializa() {
        globais.placar = criaPlacar();
    },
    desenha() {
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
        globais.placar.atualiza();
    }
}
Telas.GAME_OVER = {
    desenha() {
        mensagemGameOver.desenha();
        criaScorePlacar().desenha();
    },
    click() {
        mudaParaTela(Telas.INICIO);
    },
    atualiza() {
    }
}


function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames++;
    requestAnimationFrame(loop);
}


window.addEventListener('click', function () {
    //Ao clicar no navegador, verifica se exoste na tela ativa a função de click, se existir chama a função
    if (telaAtiva.click) {
        telaAtiva.click();
    }
})

//Começar na tela de início
mudaParaTela(Telas.INICIO);
loop();