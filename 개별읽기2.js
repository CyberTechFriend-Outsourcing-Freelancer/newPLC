//{"ip":"192.168.70.2","port":2004,"button":1,"address":"%RW700"}

msg.host = msg.payload.ip;
msg.port = msg.payload.port;
var len = msg.payload.address.length;

var companyID = [0x4C, 0x53, 0x49, 0x53, 0x2D, 0x58, 0x47, 0x54, 0x00, 0x00];
var PLCinfo = [0x00, 0x00];
var CPUinfo = [0xA0];
var SourceofFrame = [0x33];
var invokeID = [0x00, 0x00];
var length1 = [len+10, 0x00];
var FEnetPosition = [0x00];
var reserve1 = [0x00];

var header = companyID.concat(PLCinfo, CPUinfo, SourceofFrame, invokeID, length1, FEnetPosition, reserve1);

var command = [0x54, 0x00];
var datatype = [0x02, 0x00];
var reserve2 = [0x00, 0x00];
var blockNo = [0x01, 0x00];
var length2 = [len, 0x00];

var address = [];
for (i = 0; i<len; i++) {
  hex = msg.payload.address.charCodeAt(i).toString(10);
  address.push(Number(hex));
}

var protocol = header.concat(command, datatype, reserve2, blockNo, length2, address);
msg.payload = Buffer.from(protocol);
return msg;
