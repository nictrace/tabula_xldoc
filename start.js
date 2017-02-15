var xlsx = require('node-xlsx').default;
var fs = require('fs');
const path = require('path');


var file;		// входные данные пока константой


function xlDoc(filename){
  this.file = filename;
}

xlDoc.prototype.parse = function(cbError) {
  console.log('xlDoc_started');
  if(fs.existsSync(this.file)){
	 if(this.checksign()){
	 // подключаем к библиотеке
	 const workSheetsFromFile = xlsx.parse(this.file);
	  	 return workSheetsFromFile[0]['data'];
	 }
	 else{
//	  	 console.warn('file format invald!');
	  	 if(cbError != undefined) cbError('file format invalid');
	  	 return '';
	   }
  }
  else{
//      console.warn('file %s not found',this.file);
      if(cbError != undefined) cbError('file not found');
      return '';
  }
};

xlDoc.prototype.checksign = function() {
   var bytes = new Buffer(16);
   var fd = fs.openSync(this.file, 'r');
   fs.readSync(fd,bytes,0,4,0);
   var t = bytes.readUInt32BE();
   //console.log('checksign: '+ bytes.readInt32BE().toString(16));
   if(t == 0x504b0304) return true;			// xlsx опознан
   // далее надо проверить на соответствие формату xls
   else if(t == 0xD0CF11E0) return true;	// xls опознан
   return false;
}

module.exports = xlDoc;

var xls = new xlDoc('test/z1.doc');

var json_data;
try{
 json_data = xls.parse(callback);
}
catch(err){
	console.warn('parse error');
}
if(json_data != undefined) console.log(json_data);

function callback(txt) {
  console.warn('ERROR:'+ txt);
}
