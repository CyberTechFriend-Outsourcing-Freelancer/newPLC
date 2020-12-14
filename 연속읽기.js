//{"ip":"192.168.70.2","port":2004,"amount":2,"address":"%RB0700"}
msg.host = "192.168.70.2";
msg.port = 2004;
msg.topic = msg.payload.address; //토픽을 주소(%RB700)로 설정
//주소의 숫자 부분의 값을 2배로 적용.(이유는 모름) 즉, %RB0400을 넣어야 %RB0200 위치의 값을 읽음
var address = msg.payload.address.replace(/[0-9]/g,'') + Number(msg.payload.address.replace(/[^0-9]/g,''))*2
//                    (%RB 부분)                                       (뒤에 숫자 2배)
var len = address.length; //주소의 길이

var companyID = [0x4C, 0x53, 0x49, 0x53, 0x2D, 0x58, 0x47, 0x54, 0x00, 0x00];
var PLCinfo = [0x00, 0x00];
var CPUinfo = [0xA0];
var SourceofFrame = [0x33];
var invokeID = [0x00, 0x00];
var length1 = [len+12, 0x00]; //헤더 제외 뒷부분의 길이
var FEnetPosition = [0x00];
var reserve1 = [0x00];
//헤더부분(길이 20 byte)
var header = companyID.concat(PLCinfo, CPUinfo, SourceofFrame, invokeID, length1, FEnetPosition, reserve1);

var command = [0x54, 0x00];
var datatype = [0x14, 0x00];
var reserve2 = [0x00, 0x00];
var blockNo = [0x01, 0x00];
var length2 = [len, 0x00]; //주소의 길이
//주소값 ascii 값으로 변환(charCodeAt) 및 16진법으로 변환(toString(16))
var ipaddress = [];
for (i = 0; i<len; i++) {
  hex = address.charCodeAt(i).toString(10);
  ipaddress.push(Number(hex));
}

//연속읽기 하는 양을 상위바이트, 하위바이트로 구분.
//10진법숫자(amount)를 16진법으로 변환 후 뒤에 2자리를 다시 10진법으로 변환
//10진법숫자(amount)를 16진법으로 변환 후 뒤에 2자리를 제외한 나머지를 다시 10진법으로 변환
//상위바이트가 없을 때(NaN) 0x00으로 치환
//amount 예시 -> 1000개를 읽고싶을 때 1000은 16진법으로 03E8이므로 [0xE8, 0x03]이 됨.(순서 중요)
var hex = (msg.payload.amount*2).toString(16)
var lowerbyte = parseInt(hex.slice(-2),16)
var higherbyte = parseInt(hex.split(hex.slice(-2))[0],16)
var amount = [lowerbyte, higherbyte];
if(isNaN(amount[1])){
    amount[1] = 0x00;
}


var protocol = header.concat(command, datatype, reserve2, blockNo, length2, ipaddress, amount);
msg.payload = Buffer.from(protocol);
return msg;
