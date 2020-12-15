//0~300  400~406  500  600
//700~855'  1000~1300
//8200~8215  8400~8415
//9020~9035  9060~9075

//상위바이트, 하위바이트 묶어서 계산하는 function
function sum(num){
  return (msg.payload[num]+msg.payload[num+1]*256);
}

var resultobj = flow.get('data') || {};

if(msg.topic == '%RB0000'){
  for(i = 32; i < 602+32 ; i+=2){
    resultobj[(i-32)/2] = parseInt((msg.payload[i+1].toString(16)+msg.payload[i].toString(16)).slice(-3), 16);
  }
}

//데이터 개수 (payload의 30, 31번째) 2를 나눠주는 이유는 2개의 상, 하위바이트로 나뉘기 때문.
var len = sum(30)/2;

//데이터 (payload의 32번째부터)
var result = [];
for(i = 32; i < len*2+32 ; i+=2){
  result.push(sum(i));
}

if(msg.topic == '%RB0000'){
  for(i = 400;i<407;i++){
    resultobj[i] = result[i];
  }
  resultobj[500] = result[500];
  resultobj[600] = result[600].toString(2);
  resultobj[601] = result[601].toString(2);
} else if(msg.topic == '%RB0700'){
  for(i = 0;i<32;i++){
    resultobj[5*i+700] = result[5*i];
  }
  for(i = 300;i<601;i++){
    resultobj[i+700] = result[i];
  }
  resultobj[900] = result[200];
  resultobj[940] = result[240];
} else if(msg.topic == '%RB8200'){
  for(i = 0;i<16;i++){
    resultobj[i+8200] = result[i];
  }
  for(i = 0;i<16;i++){
    resultobj[i+8400] = result[200+i];
  }
} else if(msg.topic == '%RB9020'){
  for(i = 0;i<=5;i++){
    resultobj[i+9020] = result[i];
  }
  for(i = 0;i<=5;i++){
    resultobj[i+9030] = result[10+i];
  }
  for(i = 0;i<=5;i++){
    resultobj[i+9060] = result[40+i];
  }
  for(i = 0;i<=5;i++){
    resultobj[i+9070] = result[50+i];
  }
}
flow.set('data', resultobj);
if(msg.topic === '%RB9020'){
  msg.payload = resultobj;
  return msg;
}
