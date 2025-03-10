
//$("#main_canvas").width((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)-100)
//$("#main_canvas").height((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) )

//let objectID = 0
class Canvas {
    constructor(id, kanwa) {
        if(kanwa == undefined)
        {
            kanwa = document.createElement("canvas")
            document.body.appendChild(kanwa)
            kanwa.id = id
            kanwa.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)-106
            kanwa.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)  -6
        }
        this.main = kanwa
        this.width = kanwa.width
        this.height = kanwa.height
        this.canvaContext = kanwa.getContext('2d')
        this.objectID = 0
        
        this.objectShape = ""
        this.lineWidth = 1
        
        this.backgroundColor = "255, 255, 255"
    }

    reset() {
        this.canvaContext.clearRect(0,0, this.width, this.height)
    }
}

class Palette {
    constructor(htmlInput) {
        this.color = "0, 0, 0"
        this.paletteBody = htmlInput
    }

    colorChange() {
        this.color = $(this).val()
    }
}

class paintObject {
    constructor(kanwa, palette) {

        this.x = 0
        this.y = 0
        this.id 

        this.shape = kanwa.objectShape
        this.sideX = 0
        this.sideY = 0
        //this.kanwa = kanwa.mainCanva
        this.lineWidth = kanwa.lineWidth
        
        this.kolorWypelnienia = palette.color
        this.kolorObwodu = "0, 0, 0"
        this.kontekst_kanwy = kanwa.canvaContext//this.kanwa.getContext('2d')
    }

    draw() {
        
        //this.clear()
        this.kontekst_kanwy.beginPath();
        //this.kontekst_kanwy.globalCompositeOperation='destination-over';
        this.kontekst_kanwy.strokeStyle = "rgb("+this.kolorObwodu+")"
        this.kontekst_kanwy.fillStyle = "rgb("+this.kolorWypelnienia+")"
        this.kontekst_kanwy.lineWidth = this.lineWidth
        
        switch (this.shape) {
            case "rectangle":
                this.drawRectangle()
                break;
            case "circle":
                this.drawCircle()
                break;
        }
        
        this.kontekst_kanwy.stroke()
    }

    drawRectangle() {
        //this.kontekst_kanwy.strokeRect(this.x, this.y, this.sideX+0.5, this.sideY+0.5)
        this.kontekst_kanwy.fillRect(this.x, this.y, this.sideX, this.sideY)
    } 

    drawCircle() {
        //this.kontekst_kanwy.strokeRect(this.x, this.y, this.sideX+0.5, this.sideY+0.5)
        //this.kontekst_kanwy.stroke()
        this.kontekst_kanwy.ellipse(this.x+(this.sideX/2), this.y+(this.sideY/2), Math.abs(this.sideX/2), Math.abs(this.sideY/2), 0, 0, 2 * Math.PI);
        //this.kontekst_kanwy.strokeStyle  = "rgb(255,255,255)"  
        //this.kontekst_kanwy.ellipse(this.x+(this.sideX/2), this.y+(this.sideY/2), Math.abs(this.sideX/2), Math.abs(this.sideY/2), 0, 0, 2 * Math.PI);
    }

    updateColor(rgb) {
        this.kolorWypelnienia = rgb
        this.draw()
    }

}

let mouseDownID = false
//let mouseFirst = true
//let drawInterval

let object = []

let canva = new Canvas("main_canvas")
let palette = new Palette()
//let newCanva
//object[canva.objectID] = new CanObject(canva, palette)

object[canva.objectID] = new paintObject(canva, palette)

object[canva.objectID].shape = "rectangle"
object[canva.objectID].sideX = canva.width
object[canva.objectID].sideY = canva.height
object[canva.objectID].kolorWypelnienia = canva.backgroundColor
object[canva.objectID].draw()

canva.objectID++

//console.log(canva.height)

$("input").on("click", shapeChange)

$("input[name='color']").on("click", function() { palette.color = $(this).val()})

$("input[name='bucket']").on("click", function() { 
    canva.objectShape = "bucket"
})

$("input[name='rgb']").on("click", function() { 
    
    palette.color = prompt("Podaj wartość RGB:")
})

$("input[name='lineWidth']").change(function() { 
    
    canva.lineWidth = $(this).val()
})

document.addEventListener('mousemove', (event) => {
	if(mouseDownID)
    { 
        //object[canva.objectID].clear()
        canva.reset()
        for(let z=0; z<object.length-1;z++) {
            object[z].draw()
        }
        
        object[canva.objectID].sideX = event.clientX  - object[canva.objectID].x - 100
        object[canva.objectID].sideY = event.clientY - object[canva.objectID].y
       
        object[canva.objectID].draw()
    }
});

$("#main_canvas").mousedown(drag)
$("#main_canvas").mouseup(drop)

function overlapDetection (obiektA, obiektB) {

    
    return !( obiektB.x > (obiektA.x + obiektA.sideX)) || ((obiektB.x +obiektB.sideX) <  obiektA.x)  || (obiektB.y  > (obiektA.y + obiektA.sideY)) ||((obiektB.y + obiektB.sideY) <  obiektA.y)


}

function shapeChange() {
    switch ($(this).val()) {
        case "Prostokąt":
            canva.objectShape = "rectangle"
            break;
        case "Koło":
            canva.objectShape = "circle"
            break;
        case "Trójkąt":
            canva.objectShape = "triangle"
            break;
        case "Śmierć":
            //object[objectID-1] = new CanObject()
            break;
        case "Wyczyść":
            object = []
            canva.objectID=0
            canva.reset()
            break;
        case "save":
            let image = canva.main.toDataURL("image/png").replace("image/png", "image/octet-stream");
            
            let link = document.getElementById('link');
            link.setAttribute('download', 'Drawing.png');
            link.setAttribute('href', image);
            link.click();
            break;
    }
    
}

function drag(event) {
    //canva.reset()
    if(canva.objectShape != "bucket")
    {
        if(object[canva.objectID] == undefined) {

            object[canva.objectID] = new paintObject(canva, palette)
        }
        
        object[canva.objectID].x = event.clientX - 100 + 0.5
        object[canva.objectID].y = event.clientY + 0.5
        //console.log(canva.canvaContext.getImageData(object[canva.objectID].x, object[canva.objectID].y, 30, 30).data)
        mouseDownID = true
    } else {
        
        for(let z=canva.objectID-1; z>0; z--) {
            if(event.clientX - 100 > object[z].x && event.clientX - 100 < object[z].x+object[z].sideX && event.clientY>object[z].y && event.clientY < object[z].y+object[z].sideY) {
                
                object[z].kolorWypelnienia = palette.color
                
                /*for(let c =canva.objectID-1; c>0; c--) {
                    if(c-1>0) {
                        //console.log(overlapDetection(object[c], object[c-1]))
                    }
                    //console.log(overlapDetection(object[c], object[c-1]))
                }*/
                
                canva.reset()
                
                for(let x=0; x<object.length; x++) {
                    object[x].draw()
                }
            }
        } 
        
        //event.clientY 
        
    }
}


function drop() { 
    if(canva.objectShape != "bucket") {
    mouseDownID = false
    canva.objectID++
    }
}