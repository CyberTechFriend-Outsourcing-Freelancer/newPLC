//{"ip":"192.168.70.2","port":2004,"button":1,"address":"%RW700"}
msg.host = msg.payload.ip;
msg.port = msg.payload.port;
msg.topic = msg.payload.address; //토픽을 주소(%RW700)로 설정
var len = msg.payload.address.length; //주소의 길이

var companyID = [0x4C, 0x53, 0x49, 0x53, 0x2D, 0x58, 0x47, 0x54, 0x00, 0x00];
var PLCinfo = [0x00, 0x00];
var CPUinfo = [0xA0];
var SourceofFrame = [0x33];
var invokeID = [0x00, 0x00];
var length1 = [len+10, 0x00]; //헤더 제외 뒷부분의 길이
var FEnetPosition = [0x00];
var reserve1 = [0x00];
//헤더부분(길이 20 byte)
var header = companyID.concat(PLCinfo, CPUinfo, SourceofFrame, invokeID, length1, FEnetPosition, reserve1);

var command = [0x54, 0x00];
var datatype = [0x02, 0x00];
var reserve2 = [0x00, 0x00];
var blockNo = [0x01, 0x00];
var length2 = [len, 0x00]; //주소의 길이
//주소값 ascii 값으로 변환(charCodeAt) 및 16진법으로 변환(toString(16))
var address = [];
for (i = 0; i<len; i++) {
  hex = msg.payload.address.charCodeAt(i).toString(10);
  address.push(Number(hex));
}

var protocol = header.concat(command, datatype, reserve2, blockNo, length2, address);
msg.payload = Buffer.from(protocol);
return msg;
