
export function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }


export function multiply(a, b) {
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

export function sumMatrix(bigMatrix,matrix,indexROW,indexCOL){ // Suma los elementos una matriz (matrix) dentro de la matriz mayor (bigMatrix), desde unos índices iniciales (indexROW, indexCOL).
  
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