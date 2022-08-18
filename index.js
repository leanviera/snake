//tamaño del canvas
const ANCHO=500;
//intervalo del loop
const INTERVALO = 80;
//tamaño de mi cuadrado
const PESO = 10;
//configuraccion de direcciones
const DIRECCION = {
    A: [-1, 0] ,
    D: [1, 0],
    W: [0, -1] ,
    S: [0, 1] ,
    a: [-1, 0] ,
    d: [1, 0],
    w: [0, -1] ,
    s: [0, 1] ,
    ArrowUp: [0, -1] ,
    ArrowDown: [0, 1] ,
    ArrowLeft: [-1, 0] ,
    ArrowRight: [1, 0]
}
//controles y seteos de direccion y de bicho
let controles = {
    direccion:{x:1, y:0}, 
    bicho:[{x:0, y:0}],
    victima:{x:0, y:250},
    jugando : false,
    crecimiento: 0
}


//variable con las direcciones
let padonde
//referencio el canvas en JS
let papel = document.querySelector('canvas')
//referencia al contexto del canvas
let ctx = papel.getContext('2d')


let looper = ()=>{
    //armar objeto vacio de cola
    let cola ={}
    //clonar la ultima posicion de bicho en cola
    Object.assign(cola, controles.bicho[controles.bicho.length-1])
    //instancio la cabeza del bicho
    const sq = controles.bicho[0]
    //verifico que bicho atrapo a la victima
    let atrapado = sq.x === controles.victima.x && sq.y === controles.victima.y 
    //detecto si es este fram es esta vuelta del lopp
    if (detectarChoque()) {
        //pongo en false el juego
        controles.jugando = false
        //llamo a reinicar parametros
        reinicar()
    }
    //referencio la direccion actual
    let dx = controles.direccion.x;
    let dy = controles.direccion.y;
    //guardo el tamaño de mi bicho
    let tamaño = controles.bicho.length-1
    
    //pregunto si el juego corre
    if (controles.jugando) {
        //hago for de atras para adelante del bicho
         for (let idx = tamaño; idx> -1; idx--){
        //referencio la parte del bicho actual
        const sq = controles.bicho[idx]
        //pregunto si esta es la cabeza
        if (idx===0) {
            //si es la cabeza avanza en la nueva direccion por eso el +=
            sq.x += dx;
            sq.y += dy; 
        }else{
            //si no es la cabeza asigno posicion del miembro anterior
            sq.x = controles.bicho[idx-1].x;
            sq.y = controles.bicho[idx-1].y;
            }
        }
    }
   
   //verifico si atrape algo
    if (atrapado) {
        //le digo a la serpiente que creza 5
        controles.crecimiento += 5
        //y reposiciono el conejo blanco con revictima
        revictima()
        }
    //pregunto si tengo que crecer
    if (controles.crecimiento>0) {
        //agrego a mi bicho el clon de cola creado anteriotrmente
        controles.bicho.push(cola)
        controles.crecimiento -= 1
    }

    //llamo a la animacion a dibujar
    requestAnimationFrame(dibujar)
    //llamar a la funcion luego de X intervalo
    setTimeout(looper, INTERVALO)
}
//detecto choque con paredes y sobre si misma
let detectarChoque = ()=>{
    //instancia a la cabeza
    const head = controles.bicho[0]
    //pregunto si choca con los bordes o se sale de ellos
    if (head.x < 0 || head.x >= ANCHO/PESO || head.y >= ANCHO/PESO || head.y < 0 ) {
    return true  //si algun choque pasa tiro un true     
    }
    //detecto si choco contra si misma
    for (let idx =1; idx < controles.bicho.length; idx++) {
        const sq = controles.bicho[idx]
        if (sq.x === head.x && sq.y===head.y) {
            return true
        }
        
    }
}

document.onkeydown = (e)=>{  
    /// guardo el padonde la nueva direccion
    padonde = DIRECCION[e.key]
   // descontruyo x y de padonde
    const [x, y] = padonde
    //valido que no se pueda ir en direccion contraria
    if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
        //asigno la direccion a mis controles
        controles.direccion.x= x;
        controles.direccion.y= y;
    }

}

let dibujar = ()=>{
     //borra mi canvas
     ctx.clearRect(0,0,ANCHO,ANCHO)
     //recorro todo el bicho
     for (let idx = 0; idx < controles.bicho.length; idx++) {
        const {x, y} = controles.bicho[idx];
        dibujarActores('green', x, y)
     }
    
    
    //mando a  dibujar victima
    const victima = controles.victima
    dibujarActores('white', victima.x, victima.y)
    }

    //dibuja todos los cuadrados
    let dibujarActores= (color, x, y)=>{
        //indico color del dibujo
        ctx.fillStyle = color
        //creo un rectangulo (x, y, anchura, altura)
        ctx.fillRect(x*PESO,y*PESO,PESO,PESO)
    }

    //cualquier lado crea posicion y direccion ramdon
    let cualquierLado =()=>{
        //CONVIERTO A DIRECCION en un array guardandolo en direccion
        let direccion = Object.values(DIRECCION)
        return{
            x:parseInt(Math.random()*ANCHO/PESO),
            y:parseInt(Math.random()*ANCHO/PESO),
            d: direccion[parseInt(Math.random()*11)]                           

        }
    }

    //revictima posiciona a la victima cuando fue capturada
    let revictima = ()=>{
        let nuevaPosicion = cualquierLado()
        let victima = controles.victima
        victima.x = nuevaPosicion.x;
        victima.y = nuevaPosicion.y;
    }

    //reinicia el juego y sus valores
    let reinicar=()=>{
        controles = {
            direccion:{x:1, y:0}, 
            bicho:[{x:0, y:0}],
            victima:{x:0, y:250},
            jugando : false,
            crecimiento: 0
        }
        posiciones = cualquierLado()
        let head = controles.bicho[0]
        head.x = posiciones.x;
        head.y = posiciones.y;
        controles.direccion.x= posiciones.d[0];
        controles.direccion.y= posiciones.d[1];
        //posicion ramdon de la victima
        posicionVictima = cualquierLado()
        let victima = controles.victima
        victima.x = posicionVictima.x;
        victima.y = posicionVictima.y;
        controles.jugando = true
    }


//cuando el documento carga llamo a looper
window.onload = ()=>{
    reinicar()
    looper()
}