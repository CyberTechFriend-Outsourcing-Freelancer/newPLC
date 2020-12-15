function multi(address1, amount){
  msg.host = "192.168.70.2";
  msg.port = 2004;
  msg.topic = address1;
  address = address1.replace(/[0-9]/g,'') + Number(address1.replace(/[^0-9]/g,''))*2
  //                    (%RB 부분)                                  (뒤에 숫자 2배)
  len = address.length; //주소의 길이

  companyID = [0x4C, 0x53, 0x49, 0x53, 0x2D, 0x58, 0x47, 0x54, 0x00, 0x00];
  PLCinfo = [0x00, 0x00];
  CPUinfo = [0xA0];
  SourceofFrame = [0x33];
  invokeID = [0x00, 0x00];
  length1 = [len+12, 0x00]; //헤더 제외 뒷부분의 길이
  FEnetPosition = [0x00];
  reserve1 = [0x00];
  //헤더부분(길이 20 byte)
  header = companyID.concat(PLCinfo, CPUinfo, SourceofFrame, invokeID, length1, FEnetPosition, reserve1);

  command = [0x54, 0x00];
  datatype = [0x14, 0x00];
  reserve2 = [0x00, 0x00];
  blockNo = [0x01, 0x00];
  length2 = [len, 0x00]; //주소의 길이
  //주소값 ascii 값으로 변환(charCodeAt) 및 16진법으로 변환(toString(16))
  ipaddress = [];
  for (i = 0; i<len; i++) {
    hex = address.charCodeAt(i).toString(10);
    ipaddress.push(Number(hex));
  }
  //연속읽기 하는 양을 상위바이트, 하위바이트로 구분.
  amount_arr = [];
  //10진법숫자(amount)를 16진법으로 변환 후 뒤에 2자리를 다시 10진법으로 변환
  amount_arr.push(parseInt((amount*2).toString(16).slice(-2),16));
  //10진법숫자(amount)를 16진법으로 변환 후 뒤에 2자리를 제외한 나머지를 다시 10진법으로 변환
  amount_arr.push(parseInt((amount*2).toString(16).split((amount*2).toString(16).slice(-2))[0],16));
  //상위바이트가 없을 때(NaN) 0x00으로 치환
  if(isNaN(amount_arr[1])){
      amount_arr[1] = 0x00;
  }
  //amount_arr 예시 -> 1000개를 읽고싶을 때 1000은 16진법으로 03E8이므로 [0xE8, 0x03]이 됨.(순서 중요)

  protocol = header.concat(command, datatype, reserve2, blockNo, length2, ipaddress, amount_arr);
  msg.payload = Buffer.from(protocol);
  node.send(msg);
}

//main loop
var gathering = setInterval(function(){
  multi("%RB0000", 601);
  setTimeout(function(){
    multi("%RB0700", 601);
  },200)
  setTimeout(function(){
    multi("%RB8200", 216);
  },400)
  setTimeout(function(){
    multi("%RB9020", 56);
  },600)
},800)
