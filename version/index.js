'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');

module.exports = AppGenerator

function AppGenerator(args, options, config) {
    yeoman.generators.NamedBase.apply(this, arguments);
    this.version = args[0];
}

util.inherits(AppGenerator, yeoman.generators.NamedBase);

AppGenerator.prototype.comConfig = function(){
    var jsonFile = './abc.json';
    var sAbcJson = this.readFileAsString(jsonFile);
    this.comConfig = JSON.parse(sAbcJson);
}


AppGenerator.prototype.copy = function(){
    var curVer = this.comConfig.version;
    if(this.version == curVer) return false;
    copyDir(curVer,this.version);
    this.writeJson('./abc.json',function(json){
        json.version = this.version;
        return json;
    });
    this.writeJson('./package.json',function(json){
        json.version = this.version+'.0';
        return json;
    });

}

AppGenerator.prototype.writeJson = function(file,fnMap){
    if(!file || !fnMap) return false;
    var sAbcJson = this.readFileAsString(file);
    var oAbcJson = JSON.parse(sAbcJson);
    oAbcJson = fnMap.call(this,oAbcJson);
    this.write(file,JSON.stringify(oAbcJson));
}

/**
 * @param {String} origin ԭʼĿ¼���������Ƶ�Ŀ¼
 * @param {String} target Ŀ��Ŀ¼
 */
function copyDir(origin,target){
    //���ԭʼĿ¼�����ڣ����Ƴ�
    if(!path.existsSync(origin)){
        console.log(origin + 'is not exist......');
    }
    //���Ŀ��Ŀ¼�����ھʹ���һ��
    if(!path.existsSync(target)){
        fs.mkdirSync(target);
    }
    //�첽��ȡĿ¼�е����ݣ��ѷǺ������е�Ŀ¼�����ļ����Ƶ�Ŀ��Ŀ¼��
    fs.readdir(origin,function(err,datalist){
        if(err) return;
        //console.log(datalist);
        for(var i=0;i<datalist.length;i++){
            var oCurrent = origin + '/' + datalist[i];
            var tCurrent = target + '/' + datalist[i];
            //console.log(fs.statSync(origin + '/' + datalist[i]).isFile());

            //�����ǰ���ļ�,��д�뵽��Ӧ��Ŀ��Ŀ¼��
            if(fs.statSync(oCurrent).isFile()){
                fs.writeFileSync(tCurrent,fs.readFileSync(oCurrent, ''),'');
            }
            //�����Ŀ¼����ݹ�
            else if(fs.statSync(oCurrent).isDirectory()){
                copyDir(oCurrent,tCurrent);
            }

        }
    });
}
