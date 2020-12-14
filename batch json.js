var batchjson = {};
var batch = 'batch' + msg.payload[940];
batchjson[batch] = {};
for(i = 0; i<100 ; i++){
  batchjson[batch]['p'+i] = msg.payload[i];
}
flow.set('batchjson', batchjson);
msg.payload = flow.get('batchjson');
return msg;
