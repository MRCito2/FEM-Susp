//ESPACIO PARA INCLUIR REFERENCIAS DE OTRAS HOJAS JS QUE SEAN NECESARIAS PARA EJECUTAR ESTE MAIN().
//import {Node_coordX} from "./NodeCoordinates.js"
//import {Node_coordY} from "./NodeCoordinates.js"
//import {Node_coordZ} from "./NodeCoordinates.js"
//
//import {transpose} from "./MatrixFunctions.js"
//import {multiply} from "./MatrixFunctions.js"
//import {sumMatrix} from "./MatrixFunctions.js"

const { random, randomInt } = require("mathjs");
const mathjs = require("mathjs");

/* DATOS DE ENTRADA */

//Input datos resorte (geometrico) Revisar forma de creacion de objetos (constructores)
var resorte = {};
resorte.alambre = 11;
resorte.dext = 88;
resorte.vtas = 10;
resorte.altura = 310;
resorte.luz1 = 0; //Extremo Base
resorte.luz2 = 0; //Extremo Superior
//Add Sentido

var H_helice = resorte.altura-resorte.alambre;    
var H_extremo1 = resorte.alambre+resorte.luz1;
var H_extremo2 = resorte.alambre+resorte.luz2;
var H_cuerpo = H_helice-H_extremo1-H_extremo2;

var R = (resorte.dext-resorte.alambre)/2;
//Input elementos
 var nodos_x_vta = 24;
//Input datos material
var youngModulus = 206700; //en MPa
var shearModulus = 79500; //en MPa
//Input condiciones de contorno

var lownode1 = 1;
var lownode2 = 9;
var lownode3 = 17;
var upnode1 = 225;
var upnode2 = 233;
var upnode3 = 241;

//Input Desplazamiento para simulacion
var deltaY = -20;

//Calculos de geometría
var area = 0.25*Math.PI*Math.pow(resorte.alambre,2); //en mm2
var inercia = 0.25*Math.PI*Math.pow(resorte.alambre/2,4); //en mm4
var inerciapolar = inercia*2; //en mm4

//Calculos de mallado
 var elementos = resorte.vtas*nodos_x_vta;         //Total de elementos
 var nodos = elementos+1;                          //Total de nodos

//Arrays Generales
 //Arrays de nodos
   var nodeArray = [];
   var nodeRadii = [];
   var nodeTheta = [];
   var nodeVta = [];
   for (var i=0; i<nodos; i++){
      nodeArray.push(i);
      nodeTheta.push(i*360/nodos_x_vta);
      nodeVta.push(i/nodos_x_vta);
   }
 //Coordenadas cartesianas de los nodos  
   var NodeX = nodeTheta.map(Node_coordX);
   var NodeY = nodeVta.map(Node_coordY);
   var NodeZ = nodeTheta.map(Node_coordZ);

 //Declarar las dimensiones XYZ de cada elemento viga
   var ElemX=[]; 
   var ElemY=[]; 
   var ElemZ=[];
   var Long = [];

 //Declarar vectores unitarios axial(x), transversal(z) y vertical(y) del elemento
   var unit_xX = []; var unit_zX = []; var unit_yX = [];
   var unit_xY = []; var unit_zY = []; var unit_yY = [];
   var unit_xZ = []; var unit_zZ = []; var unit_yZ = [];

 //Declarar angulos entre ejes locales (xyz) y globales(XYZ) del elemento
   var ang_xX = []; var ang_zX = []; var ang_yX = [];
   var ang_xY = []; var ang_zY = []; var ang_yY = [];
   var ang_xZ = []; var ang_zZ = []; var ang_yZ = [];
 
 //Declarar vectores acumuladores de matrices
    var vectorKlocal = [];
    var vectorT = [];
    var vectorTprime = [];
    var vectorKGlobal=[];

 //OPERACIONES POR ELEMENTO   
   for (var ii=1; ii<nodos; ii++){
   
     var matrizRigLocal = new Array(12);
     var matrizTransCoord = new Array(12);      

    //Direccion de los elementos
       ElemX[ii] = NodeX[ii]-NodeX[ii-1];
       ElemY[ii] = NodeY[ii]-NodeY[ii-1];
       ElemZ[ii] = NodeZ[ii]-NodeZ[ii-1];
       Long[ii] = Math.pow(Math.pow(ElemX[ii],2)+Math.pow(ElemY[ii],2)+Math.pow(ElemZ[ii],2),0.5);

    //Unitario direccion axial (x)
       unit_xX[ii]=ElemX[ii]/Long[ii];
       unit_xY[ii]=ElemY[ii]/Long[ii];
       unit_xZ[ii]=ElemZ[ii]/Long[ii];

    //Unitario direccion transversal (z)
       unit_zX[ii]=-unit_xZ[ii]/Math.abs(unit_xZ[ii])*Math.pow(Math.pow(unit_xZ[ii],2)/(Math.pow(unit_xZ[ii],2)+Math.pow(unit_xX[ii],2)),0.5);
       unit_zY[ii]=0;
       unit_zZ[ii]=unit_xX[ii]/Math.abs(unit_xX[ii])*Math.pow(Math.pow(unit_xX[ii],2)/(Math.pow(unit_xZ[ii],2)+Math.pow(unit_xX[ii],2)),0.5);
            
    //Unitario direccion vertical (y)
       unit_yX[ii]=unit_xZ[ii]*unit_zY[ii]-unit_xY[ii]*unit_zZ[ii];
       unit_yY[ii]=unit_xX[ii]*unit_zZ[ii]-unit_xZ[ii]*unit_zX[ii];
       unit_yZ[ii]=-(unit_xX[ii]*unit_zY[ii]-unit_xY[ii]*unit_zX[ii]);

    //Angulos ejes locales (xyz) vs ejes globales (XYZ)
       ang_xX[ii]=Math.acos(unit_xX[ii])*180/Math.PI;
       ang_xY[ii]=Math.acos(unit_xY[ii])*180/Math.PI;
       ang_xZ[ii]=Math.acos(unit_xZ[ii])*180/Math.PI;
                            
       ang_zX[ii]=Math.acos(unit_zX[ii])*180/Math.PI;
       ang_zY[ii]=Math.acos(unit_zY[ii])*180/Math.PI;
       ang_zZ[ii]=Math.acos(unit_zZ[ii])*180/Math.PI;

       ang_yX[ii]=Math.acos(unit_yX[ii])*180/Math.PI;
       ang_yY[ii]=Math.acos(unit_yY[ii])*180/Math.PI;
       ang_yZ[ii]=Math.acos(unit_yZ[ii])*180/Math.PI;
              
     //Elementos de la matriz de rigidez

       var k1 = youngModulus*area/Long[ii];
       var k2 = shearModulus*inerciapolar/Long[ii];
       var k3 = 12*youngModulus*inercia/Math.pow(Long[ii],3);
       var k4 = 6*youngModulus*inercia/Math.pow(Long[ii],2);
       var k5 = 4*youngModulus*inercia/Long[ii];

     //Creacion de la matriz vacia 12x12

       for (var x = 0; x<matrizRigLocal.length; x++){
         matrizRigLocal[x]=[0,0,0,0,0,0,0,0,0,0,0,0];
       }

       //Asignacion de los elementos a la matriz
        matrizRigLocal[0][0]= k1;
        matrizRigLocal[0][6]= -k1;

        matrizRigLocal[1][1]= k3;
        matrizRigLocal[1][5]= k4;
        matrizRigLocal[1][7]= -k3;
        matrizRigLocal[1][11]= k4;

        matrizRigLocal[2][2]= k3;
        matrizRigLocal[2][4]= -k4;
        matrizRigLocal[2][8]= -k3;
        matrizRigLocal[2][10]= -k4;

        matrizRigLocal[3][3]= k2;
        matrizRigLocal[3][9]= -k2;

        matrizRigLocal[4][2]= -k4;
        matrizRigLocal[4][4]= k5;
        matrizRigLocal[4][8]= k4;
        matrizRigLocal[4][10]= k5/2;
        
        matrizRigLocal[5][1]= k4;
        matrizRigLocal[5][5]= k5;
        matrizRigLocal[5][7]= -k4;
        matrizRigLocal[5][11]= k5/2;
        
        matrizRigLocal[6][0]= -k1;
        matrizRigLocal[6][6]= k1;
        
        matrizRigLocal[7][1]= -k3;
        matrizRigLocal[7][5]= -k4;
        matrizRigLocal[7][7]= k3;
        matrizRigLocal[7][11]= -k4;
        
        matrizRigLocal[8][2]= -k3;
        matrizRigLocal[8][4]= k4;
        matrizRigLocal[8][8]= k3;
        matrizRigLocal[8][10]= k4;
        
        matrizRigLocal[9][3]= -k2;
        matrizRigLocal[9][9]= k2;
        
        matrizRigLocal[10][2]= -k4;
        matrizRigLocal[10][4]= k5/2;
        matrizRigLocal[10][8]= k4;
        matrizRigLocal[10][10]= k5;
        
        matrizRigLocal[11][1]= k4;
        matrizRigLocal[11][5]= k5/2;
        matrizRigLocal[11][7]= -k4;
        matrizRigLocal[11][11]= k5;

       //Matriz de transformacion

       for (var y = 0; y < matrizTransCoord.length; y++){
         matrizTransCoord[y]=[0,0,0,0,0,0,0,0,0,0,0,0];
       }
       for (var u = 0; u<4; u++){
         matrizTransCoord[0+3*u][0+3*u] = unit_xX[ii]; 
         matrizTransCoord[0+3*u][1+3*u] = unit_xY[ii];
         matrizTransCoord[0+3*u][2+3*u] = unit_xZ[ii];
         matrizTransCoord[1+3*u][0+3*u] = unit_yX[ii];
         matrizTransCoord[1+3*u][1+3*u] = unit_yY[ii];
         matrizTransCoord[1+3*u][2+3*u] = unit_yZ[ii];
         matrizTransCoord[2+3*u][0+3*u] = unit_zX[ii];
         matrizTransCoord[2+3*u][1+3*u] = unit_zY[ii];
         matrizTransCoord[2+3*u][2+3*u] = unit_zZ[ii];
       }
       //Almacenar matriz de rigidez del elemento
         vectorKlocal[ii]=matrizRigLocal;
       //Almacenar Matriz de transformacion
         vectorT[ii]=matrizTransCoord;
         vectorTprime[ii]=transpose(matrizTransCoord);
       //Producto
         var firstProd = multiply(transpose(matrizTransCoord),matrizRigLocal);
         var matrizRigGlobal = multiply(firstProd,matrizTransCoord);
       //Almacenar
         vectorKGlobal[ii]=matrizRigGlobal;
   } //FIN FOR DE OPERACIONES POR ELEMENTO    

 //Crear la supermatriz de rigidez del solido (llena de ceros)
   var superMatrix = new Array(nodos*6+18); //Numero de filas de la supermatriz de rigidez: #Nodos * Grados de libertad de cada nodo (son 6 en 3D). Se suman 18 filas más para las condic. contorno
   for (var z = 0; z < superMatrix.length; z++){
     superMatrix[z]=[];
     for (var zz = 0; zz < superMatrix.length; zz++){
       superMatrix[z][zz]=0;
     }
   }
 
 //Incorporar las matrices de rigidez global de cada elemento a la matriz.
   for (var p = 1; p < vectorKGlobal.length; p++){
     var matrix = vectorKGlobal[p];
     superMatrix = sumMatrix(superMatrix,matrix,(p-1)*6,(p-1)*6);
   }


 //Utilización de las condiciones de contorno.

   for (var q = 0; q<3 ; q++){
    //UX, UY, UZ de los nodos de la base
     superMatrix[nodos*6 + q][(lownode1-1)*6+q] = 1;
     superMatrix[nodos*6 + q + 3][(lownode2-1)*6+q] = 1;
     superMatrix[nodos*6 + q + 6][(lownode3-1)*6+q] = 1;

    //UX, UY, UZ de los nodos del tope
     superMatrix[nodos*6 + q + 9][(upnode1-1)*6+q] = 1;
     superMatrix[nodos*6 + q + 12][(upnode2-1)*6+q] = 1;
     superMatrix[nodos*6 + q + 15][(upnode3-1)*6+q] = 1;

    //FX, FY, FZ de los nodos de la base
     superMatrix[(lownode1-1)*6+q][nodos*6 + q] = -1;
     superMatrix[(lownode2-1)*6+q][nodos*6 + q + 3] = -1;
     superMatrix[(lownode3-1)*6+q][nodos*6 + q + 6] = -1;
     
    //FX, FY, FZ de los nodos del tope
     superMatrix[(upnode1-1)*6+q][nodos*6 + q + 9] = -1;
     superMatrix[(upnode2-1)*6+q][nodos*6 + q + 12] = -1;
     superMatrix[(upnode3-1)*6+q][nodos*6 + q + 15] = -1 

   }
   
 // Vector de coeficientes independientes:
   var coef = [];
   for (var pp = 0; pp< superMatrix.length; pp++){
     coef.push([0]);
   }
   coef[coef.length-8]=[deltaY];
   coef[coef.length-5]=[deltaY];
   coef[coef.length-2]=[deltaY];
 
 //Resolver simulacion
 //var vect=[];
 //for (var bs = 0; bs<1500; bs++){
 //  vect[bs]=[];
 //   for (var bp = 0; bp<1500; bp++){
 //   vect [bs] [bp] = Math.random();
 // }
 //}

 var inverse = mathjs.inv(superMatrix); 
 var solut = multiply(inverse,coef);

 
console.log([solut[coef.length-2],solut[coef.length-5],solut[coef.length-8],]);


//FUNCIONES
//Comentar lo de abajo cuando funcione lo de separar las hojas

function Node_coordX (nodeValue){ //Calcula coordenada X del nodo. Entrada: Posicion angular en grados sexagesimales.
  var x = R*Math.cos(nodeValue*Math.PI/180);
  return x;
}

function Node_coordY (nodeValue){ //Calcula coordenada Y del nodo. Entrada: Posicion angular en fraccion de vuelta.
//var nodeValue = 1/24;
  var y;
  if (nodeValue<=1){
    y = Math.pow((nodeValue*360),2)/(360*360/H_extremo1);
  } else if (nodeValue>(resorte.vtas-1)){
    y = Math.pow((nodeValue*360-resorte.vtas*360),2)/(360*360/(-H_extremo2))+H_helice;
  } else if (nodeValue>1 && nodeValue<=(resorte.vtas-1)){
    var inc = H_cuerpo/((resorte.vtas-2)*360)*360/nodos_x_vta;
    y = H_extremo1 + inc*(nodeValue*nodos_x_vta-nodos_x_vta);
  }
  return y;
}

function Node_coordZ (nodeValue){ //Calcula coordenada Z del nodo. Entrada: Posicion angular en grados sexagesimales.
  var z = -R*Math.sin(nodeValue*Math.PI/180);
  return z;
}


function transpose(matrix) { // Devuelve la matriz transpuesta
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }


function multiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
}

function sumMatrix(bigMatrix,matrix,indexROW,indexCOL){ // Suma los elementos una matriz (matrix) dentro de la matriz mayor (bigMatrix), desde unos índices iniciales (indexROW, indexCOL).
  
  //var bigMatrix = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  //var matrix = [[1,2],[3,4]];
  //var indexROW=0;
  //var indexCOL=0;
 
  var m=0;
  for (var i=indexROW; i<indexROW+matrix.length;i++){
  var n=0;
    for(var j=indexCOL; j<indexCOL+matrix.length; j++){
      //bigMatrix[i][j] = bigMatrix[i][j]+ matrix[indexROW-i][indexCOL-j];
      bigMatrix[i][j] = bigMatrix[i][j]+ matrix[m][n];
      n = n+1; 
    }
    m=m+1;
  }
  return bigMatrix;
}

