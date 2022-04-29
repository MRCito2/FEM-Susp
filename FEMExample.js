//Input datos resorte
var resorte = {};
resorte.alambre = 11;
resorte.dext = 88;
resorte.vtas = 10;
resorte.altura = 315;
resorte.luz1 = 0;
resorte.luz2 = 0;

var H_helice = resorte.altura-resorte.alambre;    
var H_extremo1 = resorte.alambre+resorte.luz1;
var H_extremo2 = resorte.alambre+resorte.luz2;
var H_cuerpo = H_helice-H_extremo1-H_extremo2;

var R = (resorte.dext-resorte.alambre)/2;
//Input elementos
 var nodos_x_vta = 24;
//Input datos material
var youngModulus = 205000; //en MPa
var shearModulus = 79500; //en MPa

function prueba(){
//Calculos intermedios
var area = 0.25*Math.PI*Math.pow(resorte.alambre,2); //en mm2
var inercia = 0.25*Math.PI*Math.pow(resorte.alambre/2,4); //en mm4
var inerciapolar = inercia*2; //en mm4

//Calculos
 var elementos = resorte.vtas*nodos_x_vta;         //Total de elementos
 var nodos = elementos+1;                          //Total de nodos

 //Coordenadas nodos
    //Polares

         //Array de nodos
            var nodeArray = [];
            var nodeRadii = [];
            var nodeTheta = [];
            var nodeVta = [];
            for (var i=0; i<nodos; i++){
               nodeArray.push(i);
               nodeTheta.push(i*360/nodos_x_vta);
               nodeVta.push(i/nodos_x_vta);
            }
            var NodeX = nodeTheta.map(Node_coordX);
            var NodeY = nodeVta.map(Node_coordY);
            var NodeZ = nodeTheta.map(Node_coordZ);
            //Logger.log(NodeY);

            var ElemX=[]; 
            var ElemY=[]; 
            var ElemZ=[];
            var Long = [];

            var unit_xX = [];
            var unit_xY = [];
            var unit_xZ = [];
            
            var unit_zX = [];
            var unit_zY = [];
            var unit_zZ = [];
            
            var unit_yX = [];
            var unit_yY = [];
            var unit_yZ = [];

            var ang_xX = [];
            var ang_xY = [];
            var ang_xZ = [];
            
            var ang_zX = [];
            var ang_zY = [];
            var ang_zZ = [];
            
            var ang_yX = [];
            var ang_yY = [];
            var ang_yZ = [];

            var vectorKlocal = [];
            
            for (var ii=1; ii<nodos; ii++){
           
               ElemX[ii] = NodeX[ii]-NodeX[ii-1];
               ElemY[ii] = NodeY[ii]-NodeY[ii-1];
               ElemZ[ii] = NodeZ[ii]-NodeZ[ii-1];
               Long[ii] = Math.pow(Math.pow(ElemX[ii],2)+Math.pow(ElemY[ii],2)+Math.pow(ElemZ[ii],2),0.5);

               unit_xX[ii]=ElemX[ii]/Long[ii];
               unit_xY[ii]=ElemY[ii]/Long[ii];
               unit_xZ[ii]=ElemZ[ii]/Long[ii];
               
               unit_zX[ii]=-unit_xZ[ii]/Math.abs(unit_xZ[ii])*Math.pow(Math.pow(unit_xZ[ii],2)/(Math.pow(unit_xZ[ii],2)+Math.pow(unit_xX[ii],2)),0.5);
               unit_zY[ii]=0;
               unit_zZ[ii]=unit_xX[ii]/Math.abs(unit_xX[ii])*Math.pow(Math.pow(unit_xX[ii],2)/(Math.pow(unit_xZ[ii],2)+Math.pow(unit_xX[ii],2)),0.5);
               
               unit_yX[ii]=unit_xZ[ii]*unit_zY[ii]-unit_xY[ii]*unit_zZ[ii];
               unit_yY[ii]=unit_xX[ii]*unit_zZ[ii]-unit_xZ[ii]*unit_zX[ii];
               unit_yZ[ii]=-(unit_xX[ii]*unit_zY[ii]-unit_xY[ii]*unit_zX[ii]);

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
                 
                 var matrizRigLocal = new Array(12);
                 var vector = new Array(12);
                 vector.fill(0);
                 matrizRigLocal.fill(vector);

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

                   vectorKlocal[ii]=matrizRigLocal;
               
            }
            
}

//FUNCIONES
 function Node_coordX (nodeValue){ //mapea nodetheta
   var x = R*Math.cos(nodeValue*Math.PI/180);
   return x;
 }

 function Node_coordY (nodeValue){ //es con nodevta
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

 function Node_coordZ (nodeValue){ //mapea nodetheta
   var z = -R*Math.sin(nodeValue*Math.PI/180);
   return z;
 }