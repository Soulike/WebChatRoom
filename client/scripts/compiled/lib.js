'use strict';function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var ACCOUNT_REG=/^\d+$/,NICKNAME_REG=/^[A-z0-9\u4e00-\u9fa5]{1,8}$/,PASSWORD_REG=/^[A-z0-9]{1,32}$/,AGE_REG=/^[0-9]+$/;var ALLOW_FILE_TYPES=['jpeg','png'];var OFFLINE=0,ONLINE=1,WATCHING=2,LEAVE=3;var STATUS_ICONS={OFFLINE:'glyphicon-off',ONLINE:'glyphicon-ok',WATCHING:'glyphicon-eye-open',LEAVE:'glyphicon-glass'};//const [DOMAIN, PORT] = ['127.0.0.1', 80];
var DOMAIN='47.94.152.219',PORT=80;var MESSAGE_MAX_LENGTH=50;var Register_info=function Register_info(nickname,password){_classCallCheck(this,Register_info);this.nickname=nickname;this.password=md5(password);};var Login_info=function Login_info(account,password){_classCallCheck(this,Login_info);this.account=account;this.password=md5(password);};var User_info=function User_info(nickname,age,gender){_classCallCheck(this,User_info);this.nickname=nickname;this.age=age;this.gender=gender==='male';};var Message=function Message(font,bold,font_size,content){_classCallCheck(this,Message);this.font=font;this.bold=bold;this.font_size=font_size;this.content=content;};function AJAX(action,data,success_function,error_function){var async=arguments.length>4&&arguments[4]!==undefined?arguments[4]:true;$.ajax({xhrFields:{withCredentials:true},contentType:'application/json',timeout:2000,async:async,dataType:'json',url:'http://'+DOMAIN+':'+PORT+'/'+action,method:'post',data:JSON.stringify(data),success:success_function,error:error_function});}function tip_by_id(){var id_array=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];var content=arguments[1];var position=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'left';var html=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=id_array[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var id_text=_step.value;$('#'+id_text).tooltip({container:'body',placement:''+position,trigger:'focus hover',title:''+content,html:html});}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}}function popover_by_id(){var id_array=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];var content=arguments[1];var title=arguments[2];var position=arguments.length>3&&arguments[3]!==undefined?arguments[3]:'left';var html=arguments.length>4&&arguments[4]!==undefined?arguments[4]:false;var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=id_array[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var id_text=_step2.value;$('#'+id_text).popover({container:'body',placement:position,trigger:'focus hover',title:title,content:content,html:html});}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally{if(_didIteratorError2){throw _iteratorError2;}}}}function modify_popover_content_by_id(){var id_array=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];var content=arguments[1];var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=id_array[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var id_text=_step3.value;var popover=$('#'+id_text).data('bs.popover');popover.options.content=content;}}catch(err){_didIteratorError3=true;_iteratorError3=err;}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return();}}finally{if(_didIteratorError3){throw _iteratorError3;}}}}function tip_by_className(className,content){var position=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'left';$('.'+className).tooltip({container:'body',placement:''+position,trigger:'focus hover',title:''+content});}function change_border_color_to($selector_array){var color=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'red';var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=$selector_array[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){var selector=_step4.value;$(selector).css('borderColor',color);}}catch(err){_didIteratorError4=true;_iteratorError4=err;}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return();}}finally{if(_didIteratorError4){throw _iteratorError4;}}}}function show_tip(content){var type=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'success';var SHOW_TIME=2000;var $body=$('body');var icon=void 0,alert_type=type;switch(type){case'success':{icon='glyphicon-ok-sign';break;}case'info':{icon='glyphicon-info-sign';break;}case'error':{alert_type='danger';icon='glyphicon-remove-sign';}}var last=Date.now();$body.append('<div class="alert alert-'+alert_type+' modify_alert center" role="alert" id='+last+'>\n \t\t\t<span class=\'glyphicon '+icon+'\'></span> '+content+'\n \t\t</div>');var $last=$('#'+last);setTimeout(function(){$last.remove();},SHOW_TIME);}function is_existent(file_relative_path){var status=true;$.ajax({contentType:'text/plain',timeout:2000,url:'http://'+DOMAIN+':'+PORT+'/'+file_relative_path,method:'get',async:false,success:function success(){status=true;},error:function error(){status=false;}});return status;}function report(content){AJAX('report',{content:content},function(response){console.log(content);console.log(response);},function(error){console.log(content);console.log(error);});}function preview_image($img_selector,$input_selector){if($($input_selector)[0].files.length){var file_reader=new FileReader();file_reader.readAsDataURL($($input_selector)[0].files[0]);file_reader.onload=function(){$($img_selector).attr('src',file_reader.result);};}}function file_upload(action,$upload_input,success_function,error_function){var $progress_bar=arguments.length>4&&arguments[4]!==undefined?arguments[4]:undefined;var async=arguments.length>5&&arguments[5]!==undefined?arguments[5]:true;var formData=new FormData();for(var i=0;i<$upload_input[0].files.length;i++){formData.append('file',$upload_input[0].files[i]);}$.ajax({xhrFields:{withCredentials:true},url:'http://'+DOMAIN+':'+PORT+'/'+action,method:'post',data:formData,processData:false,contentType:false,async:async,success:success_function,error:error_function,xhr:function xhr(){//获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
var myXhr=$.ajaxSettings.xhr();if($progress_bar){if(myXhr.upload){//检查upload属性是否存在
myXhr.upload.addEventListener('progress',function(event)//绑定progress事件的回调函数
{if(event.lengthComputable){var percent=event.loaded/event.total*100;$progress_bar.css('width',percent+'%');}},false);}}return myXhr;//xhr对象返回给jQuery使用
}});}$(function(){$('input').focus(function(event){$(event.target).removeAttr('style');});});