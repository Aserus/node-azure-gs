var exec = require('child_process').exec;
var path = require('path');




function _numberZero(n, needLength) {
	needLength = needLength || 2;
	n = String(n);
	while (n.length < needLength) {
		n = "0" + n;
	}
	return n
}

function GSClass(options,execOptions){
	this.before_exec ='';
	if(execOptions && execOptions.reduced_load){
		this.before_exec = 'nice -10 ';
	}

	this._execPath ='gs';
	if(process.platform=='win32' || process.platform=='win64'){
		if(process.arch=='x64'){
			this._execPath =path.join(__dirname,'common/gs/bin64/gswin64c');
		}else{
			this._execPath =path.join(__dirname,'common/gs/bin32/gswin32c');
		}
	}

}

GSClass.prototype.exec = function(pdfFile,options,onComplete) {
  exec(this.before_exec+pathGSexe+' '+ options.join(' ')+' '+pdfFile , (err) =>{
    if (err) return onComplete(err);
    onComplete(err,true)
  });
}

GSClass.prototype.pdfPageToImage = function(file,outfile,page,onComplete) {
  var command=[];

  command.push('-dNOPAUSE');
  command.push('-k64MiB');
  command.push('-dSAFER');
  command.push('-dBATCH');
  command.push('-sDEVICE=png16m');
  command.push('-r192');
  command.push('-dUseCIEColor');
  command.push('-dGridFitTT=2');
  command.push('-dTextAlphaBits=4');
  command.push('-dGraphicsAlphaBits=4');
  command.push('-dMaxStripSize=8192');

  command.push('-dFirstPage='+page);
  command.push('-dLastPage='+page);


  command.push('-sOutputFile='+outfile);

  this.exec(file,command,(err)=>{
    onComplete(err,outfile)
  });
}


GSClass.prototype.pdfToImages = function(file,outMask,end,onComplete) {
  var command=[];

  command.push('-dNOPAUSE');
  command.push('-k64MiB');
  command.push('-dSAFER');
  command.push('-dBATCH');
  command.push('-sDEVICE=png16m');
  command.push('-r192');
  command.push('-dUseCIEColor');
  command.push('-dGridFitTT=2');
  command.push('-dTextAlphaBits=4');
  command.push('-dGraphicsAlphaBits=4');
  command.push('-dMaxStripSize=8192');

  command.push('-dFirstPage='+1);
  command.push('-dLastPage='+end);

  outMask+= '_%03d';
  command.push('-sOutputFile='+outMask);

  this.exec(file,command,(err)=>{

    var list = [];
    for (var i = 1; i<=end; i++){
      list.push(outMask.replace('%03d',_numberZero(i,3)));
    }

    onComplete(err,list)
  });
}


module.exports = GSClass;
