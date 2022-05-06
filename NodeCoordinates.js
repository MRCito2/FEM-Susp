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