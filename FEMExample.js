//ESPACIO PARA INCLUIR REFERENCIAS DE OTRAS HOJAS JS QUE SEAN NECESARIAS PARA EJECUTAR ESTE MAIN().

/* DATOS DE ENTRADA */

//Input datos resorte (geometrico) Revisar forma de creacion de objetos (constructores)
var resorte = {};
resorte.alambre = 11;
resorte.dext = 88;
resorte.vtas = 10;
resorte.altura = 315;
resorte.luz1 = 0;
resorte.luz2 = 0;
//FALTA AÑADIR EL SENTIDOOOO!!!!!

//Input elementos (tamaño de malla)
var nodos_x_vta = 24;
//Input datos material
var youngModulus = 206700; //en MPa
var shearModulus = 79500; //en MPa
//Input condiciones de contorno


//Calculos de geometría
var H_helice = resorte.altura-resorte.alambre;    
var H_extremo1 = resorte.alambre+resorte.luz1;
var H_extremo2 = resorte.alambre+resorte.luz2;
var H_cuerpo = H_helice-H_extremo1-H_extremo2;

var R = (resorte.dext-resorte.alambre)/2;
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
    var ax_X]; var unit_zX = []; var unit_yX = [];
    var ax_Y]; var unit_zY = []; var unit_yY = [];
    var ax_Z]; var unit_zZ = []; var unit_yZ = [];

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

        var elemX = ElemX[ii];
        var elemY = ElemX[ii];
        var elemZ = ElemX[ii];

        Long[ii] = Math.pow(Math.pow(elemX,2)+Math.pow(elemY,2)+Math.pow(elemZ,2),0.5);

        var longElem = Long[ii];

     //Unitario direccion axial (x)
        unit_xX[ii]=elemX/longElem;
        unit_xY[ii]=elemY/longElem;
        unit_xZ[ii]=elemZ/longElem;

        var ax_X = unit_xX[ii];
        var ax_Y = unit_xY[ii];
        var ax_Z = unit_xZ[ii];

     //Unitario direccion transversal (z)
        unit_zX[ii]=-ax_Z/Math.abs(ax_Z)*Math.pow(Math.pow(ax_Z,2)/(Math.pow(ax_Z,2)+Math.pow(ax_X,2)),0.5);
        unit_zY[ii]=0;
        unit_zZ[ii]=ax_X/Math.abs(ax_X)*Math.pow(Math.pow(ax_X,2)/(Math.pow(ax_Z,2)+Math.pow(ax_X,2)),0.5);
             
     //Unitario direccion vertical (y)
        unit_yX[ii]=ax_Z*unit_zY[ii]-ax_Y*unit_zZ[ii];
        unit_yY[ii]=ax_X*unit_zZ[ii]-ax_Z*unit_zX[ii];
        unit_yZ[ii]=-(ax_X*unit_zY[ii]-ax_Y*unit_zX[ii]);

     //Angulos ejes locales (xyz) vs ejes globales (XYZ)
        ang_xX[ii]=Math.acos(ax_X)*180/Math.PI;
        ang_xY[ii]=Math.acos(ax_Y)*180/Math.PI;
        ang_xZ[ii]=Math.acos(ax_Z)*180/Math.PI;
                             
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
          matrizTransCoord[0+3*u][0+3*u] = ax_X; 
          matrizTransCoord[0+3*u][1+3*u] = ax_Y;
          matrizTransCoord[0+3*u][2+3*u] = ax_Z;
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

    //Crear la supermatriz de rigidez del solido
