

// --------------------SOME GLOBAL STUFF----------------------
var element = document.getElementById("gameboard");
const ncolor = {
    1:"blue",
    2:"green",
    3:"red",
    4:"purple",
    5:"blmaroonack",
    6:"turquoise",
    7:"black",
    8:"gray"
}

function tile(){
    this.value = 0; //-1 - bomb, 0 - empty
    this.flag = false;
    this.open = false;
}
var timer_on = true;
var unopened = 256;
var flags = 40;
//-----------------TIMER-----------
var timer = document.getElementById("timer")
let count = 0;
var intervalId = window.setInterval(() => {
    time(timer);

}, 1000);


// .map() calls a function on each element in the parent array
var field = Array(16).fill().map(() => 
Array(16).fill().map(() => new tile())
);


// --------------------INITIALIZATION----------------------

//
function generate_bombs(field){
    // If we look at the matrix as an array of 256 elements, we can randomly choose 40 of them to be bombs
    // And then calculate the coordinates
    let bombs = [];
    while(bombs.length<40){
        var number = Math.floor(Math.random()*255);
        if(bombs.indexOf(number) === -1){
            bombs.push(number);
        }
    }
    var bomb_coordinates = [];
    bombs.forEach(b => {bomb_coordinates.push([Math.floor(b/16), b%16])})
    // console.log(bomb_coordinates);
    bomb_coordinates.forEach(bc => {
        field[bc[0]][bc[1]].value = -1;
    })
    // console.log(field)
}
function init(){


    // --------------------PLAY MODE---------------------
    generate_bombs(field);
    generate_numbers(field);
    for(let i = 0; i<16; i++){
        for(let j = 0; j<16; j++){
            let temp = document.createElement("div");
            temp.style.backgroundImage = "url('/images/tile.png')";
            temp.style.backgroundSize = "100% 100%";
            temp.style.border = ""
            //HERE
            temp.setAttribute("type","button");

            temp.addEventListener('click', function handler(){
                lfield(i,j,field);
            })
            temp.addEventListener('contextmenu', function handler(e) { 
                rfield(i,j);
                e.preventDefault();
            });
            temp.setAttribute("id", [i,j]);
            element.appendChild(temp);
        }
    }

}
    



// --------------------GAME----------------------

function lfield(x,y,field){ //Open tile

    if(field[x][y].flag == true){return} //Exit the function if the tile is flagged

    console.log([x,y]);
    if(field[x][y].value === -1){
        gameOver(field);
        return;
    }
    else if(field[x][y].value === 0){
        
        field[x][y].open = true;
        var tile = document.getElementById([x,y]);
        tile.style.background = "#B8B8B8";
        tile.style.backgroundImage = " ";
        tile.style.border = "0.1vmin solid black"
        tile.parentNode.replaceChild(tile.cloneNode(1), tile);

        
        // I'm so sorry for this, I'm doing this in a hurry, but here is some spaghetti recursion

        
        if(x+1<16 && !field[x+1][y].open){ 
            console.log(y+" Up");
            lfield(x+1, y, field);
        }
        if(x-1>=0 && !field[x-1][y].open){ 
            console.log(y +" Down");
            lfield(x-1, y, field);
        }
        if(y+1<16 && !field[x][y+1].open){ 
            console.log(y+1+" Left");
            lfield(x, y+1, field);
        }
        if(y-1>=0 && !field[x][y-1].open){ 
            console.log(y-1+" Right");
            lfield(x, y-1, field);
        }
        if(y-1>=0 && x-1>=0 && !field[x-1][y-1].open){ 
            console.log(y-1+" Lower right");
            lfield(x-1, y-1, field);
        }
        if(y+1<16 && x+1<16 && !field[x+1][y+1].open){ 
            console.log(y+1+" Upper Left");
            lfield(x+1, y+1, field);
        }
        if(y-1>=0 && x+1<16 && !field[x+1][y-1].open){ 
            console.log(y-1+" Upper right");
            lfield(x+1, y-1, field); 
        }
        if(y+1<16 && x-1>=0 && !field[x-1][y+1].open){ 
            console.log(y+1+" Lower Left");
            lfield(x-1, y+1, field);
        }



    }
 else{  
        if(!field[x][y].open)
       {     var openField = document.createElement('div');
            openField.style.background = "#B8B8B8";
            openField.style.textAlign = "center";
            openField.style.fontSize = "3.5vmin"
            openField.style.fontWeight = "bold"
            openField.style.color = ncolor[field[x][y].value];
            openField.innerHTML = field[x][y].value;
            field[x][y].open = true;
            openField.style.border = "0.1vmin solid black"
            openField.style.gridRowStart = x+1;
            openField.style.gridColumnStart = y+1;
            gameboard.appendChild(openField);
            let temp = document.getElementById([x,y]);
            temp = gameboard.removeChild(temp);}
    }
    
    unopened--;
    check_tiles();
}

function rfield(x,y){ //Mark tile

    var mine_count = document.getElementById("bombs");
    var display = "err"
        if(field[x][y].flag == false && flags>0){
            field[x][y].flag = true;
            let temp = document.getElementById([x,y]);
            temp.style.backgroundImage = "url('/images/flag.png')";
            flags--;
            if(parseInt(mine_count.innerHTML)<10){display='00'+(parseInt(mine_count.innerHTML)-1);}
            if(parseInt(mine_count.innerHTML)>=10){display='0'+(parseInt(mine_count.innerHTML)-1);}
            mine_count.innerHTML = display;
            unopened--;
            check_tiles();
        }
        else if(field[x][y].flag == true ){
            field[x][y].flag = false;
            let temp = document.getElementById([x,y]);
            temp.style.backgroundImage = "url('/images/tile.png')";
            flags++;
            if(parseInt(mine_count.innerHTML)<10){display='00'+(parseInt(mine_count.innerHTML)+1);}
            if(parseInt(mine_count.innerHTML)>=10){display='0'+(parseInt(mine_count.innerHTML)+1);}
            mine_count.innerHTML = display;
            unopened++;
            check_tiles();
        }
}

function generate_numbers(field){
    let number = 0;
    for(let i = 0; i<16; i++){
        for(let j = 0; j<16; j++){
            if(field[i][j].value != -1){ //If the field is not a bomb, increse the value if there is a bomb
                if(i+1<16 && field[i+1][j].value === -1){ 
                    field[i][j].value++;
                }
                if(i-1>=0 && field[i-1][j].value === -1){ 
                    field[i][j].value++;
                }
                if(j+1<16 && field[i][j+1].value === -1){ 
                    field[i][j].value++;
                }
                if(j-1>=0 && field[i][j-1].value === -1){ 
                    field[i][j].value++;
                }
                if(j-1>=0 && i-1>=0 && field[i-1][j-1].value === -1){ 
                    field[i][j].value++;
                }
                if(j+1<16 && i+1<16 && field[i+1][j+1].value === -1){ 
                    field[i][j].value++;
                }
                if(j-1>=0 && i+1<16 && field[i+1][j-1].value === -1){ 
                    field[i][j].value++;
                }
                if(j+1<16 && i-1>=0 && field[i-1][j+1].value === -1){ 
                    field[i][j].value++;
                }
            }
            

        }
    }
    
}
function gameOver(field){
    var button = document.getElementById("button");
    button.style.backgroundImage = "url('/images/gameOver.jpg')";
    for(let i = 0; i<16; i++){
        for(let j = 0; j<16; j++){
            var tile = document.getElementById([i,j]);
            if(field[i][j].value === -1){
                tile.style.backgroundImage = "url('/images/mine1.jpeg')";
                tile.style.border = "solid black 0.1vmin";
            }

            // A fun way to remove all event listeners from an element
            if(!field[i][j].open){
            tile.parentNode.replaceChild(tile.cloneNode(1), tile);
            }
        }
    }
    timer_on = false;
}

function time(timer){
    if(timer_on){
        count++;
        var display;

        if(count<10) display = '00' + count;
        if(count>=10 && count<100) display = '0' + count;
        if(count>=100) display = count;

        timer.innerHTML = display;
    }
}

function check_tiles(){
    if(unopened <= 0){
        var button = document.getElementById("button");
        button.style.backgroundImage = "url('/images/win.jpeg')"
        timer_on = false;
        console.log(timer);
        if(count<70){
            kupon = generate_coupon();
            window.alert("Kupon za kafu (Mozes preuzeti samo jedan posto kafe nisu jeftine) : COUPON-"+kupon+"ab");
        }
        else{
        window.alert("Bravoo Marija legendo!!!...Mislim moze bolje...Ali nije ni ovo lose :)")
        }
    }
}

function generate_coupon(){
    var kupon = '';
    var chars = "ABCDEFGHIJKLMNOP";
    var charLength = chars.length;
    for(var i = 0; i<5; i++){
        kupon += chars.charAt(Math.floor(Math.random()* charLength));
    }
    return kupon;

}
function reset(){
    window.location.reload();
}

// CHEAT
function cheat(){
    for(let i = 0; i<16; i++){
        for(let j = 0; j<16; j++){
            if(field[i][j].value == -1){
                rfield(i,j);
            }
        }
    }
}

init();