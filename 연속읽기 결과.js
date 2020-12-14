//상위바이트, 하위바이트 묶어서 계산하는 function
function sum(num){
  return (msg.payload[num]+msg.payload[num+1]*256);
}
//데이터 개수 (payload의 30, 31번째) 2를 나눠주는 이유는 2개의 상, 하위바이트로 나뉘기 때문.
var len = sum(30)/2;
//데이터 (payload의 32번째부터)
var result = [];
for(i = 32; i < len*2+32 ; i+=2){
  result.push(sum(i));
}
msg.payload = result;
return msg;

//714개가 최대
