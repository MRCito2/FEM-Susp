OM = Discretizacion3;

%GM: Matriz de coeficientes

A = size(OM,1);
GM = zeros(A+18,A+18);
GM(1:A,1:A) = OM;

%Nodos
a=2; b=12; c=25; d=236; e=245; f=251;

%BC
GM(A+1,1+a*6)=1; GM(A+2,2+a*6)=1; GM(A+3,3+a*6)=1; %UX, UY, UZ de nodo a
GM(A+4,1+b*6)=1; GM(A+5,2+b*6)=1; GM(A+6,3+b*6)=1; %UX, UY, UZ de nodo b
GM(A+7,1+c*6)=1; GM(A+8,2+c*6)=1; GM(A+9,3+c*6)=1; %UX, UY, UZ de nodo c

GM(A+10,1+d*6)=1; GM(A+11,2+d*6)=1; GM(A+12,3+d*6)=1; %UX, UY, UZ de nodo d
GM(A+13,1+e*6)=1; GM(A+14,2+e*6)=1; GM(A+15,3+e*6)=1; %UX, UY, UZ de nodo e
GM(A+16,1+f*6)=1; GM(A+17,2+f*6)=1; GM(A+18,3+f*6)=1; %UX, UY, UZ de nodo f

GM(1+a*6,A+1)=-1; GM(2+a*6,A+2)=-1; GM(3+a*6,A+3)=-1; %FX, FY, FZ de nodo a (desconocido)
GM(1+b*6,A+4)=-1; GM(2+b*6,A+5)=-1; GM(3+b*6,A+6)=-1; %FX, FY, FZ de nodo b (desconocido)
GM(1+c*6,A+7)=-1; GM(2+c*6,A+8)=-1; GM(3+c*6,A+9)=-1; %FX, FY, FZ de nodo c (desconocido)

GM(1+d*6,A+10)=-1; GM(2+d*6,A+11)=-1; GM(3+d*6,A+12)=-1; %FX, FY, FZ de nodo d (desconocido)
GM(1+e*6,A+13)=-1; GM(2+e*6,A+14)=-1; GM(3+e*6,A+15)=-1; %FX, FY, FZ de nodo e (desconocido)
GM(1+f*6,A+16)=-1; GM(2+f*6,A+17)=-1; GM(3+f*6,A+18)=-1; %FX, FY, FZ de nodo f (desconocido)

Coef = zeros(A+18,1);
Y = -20;
Coef(A+11,1)= Y;
Coef(A+14,1)= Y;
Coef(A+17,1)= Y;

Sol = inv(GM)*Coef;
