'use strict';/**Get user's info**/$(function(){var $body=$('body');var $nickname=$('#nickname');var $avatar=$('#avatar');var $current_avatar=$('#current-avatar');var $new_nickname=$('#new-nickname');var $new_age=$('#new-age');var $new_gender=$('#new-gender');AJAX('get_user_info',{},function(response){var code=response.code,message=response.message,data=response.data;if(code===false)show_error_modal();else{var account=data.account,nickname=data.nickname,age=data.age,gender=data.gender,customize_avatar=data.customize_avatar,customize_background=data.customize_background;sessionStorage.setItem('account',account);$nickname.text(nickname);$new_nickname.val(nickname);$new_age.val(age);$new_gender.val(gender===true?'male':'female');if(customize_avatar===true){var existent=false;var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=ALLOW_FILE_TYPES[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var file_type=_step.value;if(is_existent('images/avatars/'+account+'.'+file_type)){existent=true;$avatar.attr('src','images/avatars/'+account+'.'+file_type);$current_avatar.attr('src','images/avatars/'+account+'.'+file_type);}}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}if(existent===false)report('\u8D26\u6237'+account+'\u5934\u50CF\u4E22\u5931');}if(customize_background===true){var _existent=false;var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=ALLOW_FILE_TYPES[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var _file_type=_step2.value;if(is_existent('images/backgrounds/'+account+'.'+_file_type)){_existent=true;$body.css('backgroundImage','url(\'images/backgrounds/'+account+'.'+_file_type+'\')');}}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally{if(_didIteratorError2){throw _iteratorError2;}}}if(_existent===false)report('\u8D26\u6237'+account+'\u80CC\u666F\u4E22\u5931');}else $body.css('backgroundImage','url(\'images/backgrounds/background.jpg\')');popover_by_id(['avatar'],'<span class="glyphicon glyphicon-user"></span> \u8D26\u53F7\uFF1A'+account+'<br/>\n<span class="glyphicon glyphicon-heart"></span> \u6635\u79F0\uFF1A'+nickname+'<br/>\n<span class="glyphicon glyphicon-globe"></span> \u5E74\u9F84\uFF1A'+age+'<br/>\n<span class="glyphicon glyphicon-leaf"></span> \u6027\u522B\uFF1A'+(gender?'男':'女'),'<span class="glyphicon glyphicon-info-sign"></span>  \u7528\u6237\u4FE1\u606F','right',true);}},function(error){console.log(error.stack);show_error_modal();});$body.css('transition','5s background-image');});/**Get list**/$(function(){get_list();});/**
 * data:
 * [
 *      {account,nickname,age,gender,status,customize_avatar}
 * ]
 * **/function get_list(){AJAX('get_list',{},function(response){var code=response.code,message=response.message,data=response.data;if(code===false)show_error_modal();else{var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=data[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var info_obj=_step3.value;list_add_row(info_obj);}}catch(err){_didIteratorError3=true;_iteratorError3=err;}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return();}}finally{if(_didIteratorError3){throw _iteratorError3;}}}}},function(error){console.log(error);show_error_modal();});}/**Add tips**/$(function(){tip_by_id(['avatar-link'],'点击修改信息');tip_by_id(['new-nickname'],'输入昵称，8位以内字母、数字与汉字','top');tip_by_id(['new-age'],'输入年龄，0-120数字','top');tip_by_id(['new-gender'],'选择性别','top');tip_by_id(['switch-status-btn'],'点击修改在线状态','right');});/**Show fonts label in its style**/$(function(){var $font_style=$('.font-style');var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=$font_style[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){var link=_step4.value;$(link).css('fontFamily',$(link).text()+',serif');}}catch(err){_didIteratorError4=true;_iteratorError4=err;}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return();}}finally{if(_didIteratorError4){throw _iteratorError4;}}}});/**Show fonts label in its size**/$(function(){var $font_size=$('.font-size');var _iteratorNormalCompletion5=true;var _didIteratorError5=false;var _iteratorError5=undefined;try{for(var _iterator5=$font_size[Symbol.iterator](),_step5;!(_iteratorNormalCompletion5=(_step5=_iterator5.next()).done);_iteratorNormalCompletion5=true){var link=_step5.value;$(link).css('fontSize',$(link).text()+'px');}}catch(err){_didIteratorError5=true;_iteratorError5=err;}finally{try{if(!_iteratorNormalCompletion5&&_iterator5.return){_iterator5.return();}}finally{if(_didIteratorError5){throw _iteratorError5;}}}});/**Set font**/$(function(){var $font_style=$('.font-style');var $font_size=$('.font-size');var $bold_btn=$('#bold-btn');var $dialog_textarea=$('#dialog-textarea');$font_style.click(function(e){e.preventDefault();var font_style=e.target.text;$dialog_textarea.css('fontFamily',font_style+',serif');});$font_size.click(function(e){e.preventDefault();var font_size=e.target.text;$dialog_textarea.css('fontSize',font_size+'px');});var is_bold=false;$bold_btn.click(function(){is_bold=!is_bold;if(is_bold){$bold_btn.addClass('active');$dialog_textarea.css('fontWeight','bold');}else{$bold_btn.removeClass('active');$dialog_textarea.css('fontWeight','normal');}});});/**Count message length**//**If the text area is empty, prevent submitting**/$(function(){var $dialog_textarea=$('#dialog-textarea');var $dialog_submit_button=$('#dialog-submit-button');var $message_length_span=$('#message-length-span');$message_length_span.text('0/'+MESSAGE_MAX_LENGTH);$dialog_textarea.attr('maxlength',MESSAGE_MAX_LENGTH);$dialog_textarea.bind('input propertyChange',function(){if(!$dialog_textarea.val())$dialog_submit_button.attr('disabled','disabled');else $dialog_submit_button.removeAttr('disabled');$message_length_span.text($dialog_textarea.val().length+'/'+MESSAGE_MAX_LENGTH);if($dialog_textarea.val().length>=MESSAGE_MAX_LENGTH)$message_length_span.removeClass('label-primary').addClass('label-danger');else $message_length_span.removeClass('label-danger').addClass('label-primary');});});/**Offline modal settings**/$(function(){var $offline_modal=$('#offline-modal');$offline_modal.on('hidden.bs.modal',function(event){event.preventDefault();sessionStorage.clear();location.href='index.html';});});/**Switch online status**/$(function(){var $status=$('.status');$status.click(function(event){var status=$(event.target).attr('id');switch_status_to(status);});});function switch_status_to(status){var async=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var $status_icon=$('#status-icon');AJAX('switch_status',{status:status},function(response){var code=response.code,message=response.message,data=response.data;if(parseInt(status)===0)location.href='index.html';if(code===false)show_error_modal();else{$status_icon.removeAttr('class');$status_icon.addClass('glyphicon').addClass(Object.values(STATUS_ICONS)[status]);}},function(error){console.log(error.stack);show_tip('状态切换失败','error');},async);}/**Upload avatar preview**/$(function(){var $current_avatar=$('#current-avatar');$('#avatar-upload-control').change(function(){preview_image($current_avatar,$('#avatar-upload-control'));});});/**Upload and change background**/$(function(){var $background_upload_control=$('#background-upload-control');var $modify_style_modal=$('#modify-style-modal');var $modify_style_modal_button=$('#modify-style-modal-button');var $background_upload_progress_bar=$('#background-upload-progress-bar');var $body=$('body');$modify_style_modal_button.click(function(event){event.preventDefault();file_upload('background_upload',$background_upload_control,function(response){var code=response.code,message=response.message,data=response.data;if(code===false)show_tip(message,'error');else{show_tip(message);var account=data.account;$modify_style_modal.modal('hide');$background_upload_progress_bar.css('width',0);$background_upload_control.replaceWith('<input type="file" id="background-upload-control" accept="image/jpeg,image/png">');$background_upload_control=$('#background-upload-control');var existent=false;var _iteratorNormalCompletion6=true;var _didIteratorError6=false;var _iteratorError6=undefined;try{for(var _iterator6=ALLOW_FILE_TYPES[Symbol.iterator](),_step6;!(_iteratorNormalCompletion6=(_step6=_iterator6.next()).done);_iteratorNormalCompletion6=true){var file_type=_step6.value;if(is_existent('images/backgrounds/'+account+'.'+file_type)){existent=true;$body.css('backgroundImage','url(\'images/backgrounds/'+account+'.'+file_type+'?'+Date.now()+'\')');}}}catch(err){_didIteratorError6=true;_iteratorError6=err;}finally{try{if(!_iteratorNormalCompletion6&&_iterator6.return){_iterator6.return();}}finally{if(_didIteratorError6){throw _iteratorError6;}}}if(existent===false)report('\u8D26\u6237'+account+'\u80CC\u666F\u4E22\u5931');}},function(error){show_tip('发生错误，请重试','error');console.log(error);},$background_upload_progress_bar);});});/**Modify info submit**/$(function(){var $modify_info_modal=$('#modify-info-modal');var $modify_info_modal_button=$('#modify-info-modal-button');var $avatar_upload_control=$('#avatar-upload-control');var $new_nickname=$('#new-nickname');var $new_gender=$('#new-gender');var $new_age=$('#new-age');var $avatar=$('#avatar');var $current_avatar=$('#current-avatar');var $nickname=$('#nickname');var avatar_upload_success=true,modify_success=true;$modify_info_modal_button.click(function(event){event.preventDefault();if($avatar_upload_control[0].files.length!==0){file_upload('avatar_upload',$avatar_upload_control,function(response){var code=response.code,message=response.message,data=response.data;avatar_upload_success=code;if(code===true){var account=data.account;var existent=false;$avatar_upload_control.replaceWith('<input type="file" id="avatar-upload-control">');$avatar_upload_control=$('#avatar-upload-control');var _iteratorNormalCompletion7=true;var _didIteratorError7=false;var _iteratorError7=undefined;try{for(var _iterator7=ALLOW_FILE_TYPES[Symbol.iterator](),_step7;!(_iteratorNormalCompletion7=(_step7=_iterator7.next()).done);_iteratorNormalCompletion7=true){var file_type=_step7.value;if(is_existent('images/avatars/'+account+'.'+file_type)){existent=true;$avatar.attr('src','images/avatars/'+account+'.'+file_type+'?'+Date.now());$current_avatar.attr('src','images/avatars/'+account+'.'+file_type+'?'+Date.now());}}}catch(err){_didIteratorError7=true;_iteratorError7=err;}finally{try{if(!_iteratorNormalCompletion7&&_iterator7.return){_iterator7.return();}}finally{if(_didIteratorError7){throw _iteratorError7;}}}if(existent===false)report('\u8D26\u6237'+account+'\u5934\u50CF\u4E22\u5931');}},function(error){avatar_upload_success=false;console.log(error.stack);});}var _ref=[$new_nickname.val(),$new_age.val(),$new_gender.val()],new_nickname=_ref[0],new_age=_ref[1],new_gender=_ref[2];var status=true;if(!NICKNAME_REG.test(new_nickname)){change_border_color_to($new_nickname);status=false;}if(!AGE_REG.test(new_age)){change_border_color_to($new_age);status=false;}if(new_gender!=='male'&&new_gender!=='female'){change_border_color_to($new_gender);status=false;}if(status===false)show_tip('信息填写有误','error');else{var data=new User_info(new_nickname,new_age,new_gender);AJAX('modify_info',data,function(response){var code=response.code,message=response.message,data=response.data;var account=data.account;modify_success=code;if(modify_success){$nickname.text($new_nickname.val());modify_popover_content_by_id(['avatar'],'<span class="glyphicon glyphicon-user"></span> \u8D26\u53F7\uFF1A'+account+'<br/>\n<span class="glyphicon glyphicon-heart"></span> \u6635\u79F0\uFF1A'+new_nickname+'<br/>\n<span class="glyphicon glyphicon-globe"></span> \u5E74\u9F84\uFF1A'+new_age+'<br/>\n<span class="glyphicon glyphicon-leaf"></span> \u6027\u522B\uFF1A'+(new_gender==='male'?'男':'女'));}},function(error){modify_success=false;console.log(error.stack);},false);if(!avatar_upload_success&&!modify_success)show_tip('修改失败，请重试','error');else if(!avatar_upload_success||!modify_success)show_tip('部分修改成功，请重试','info');else{$modify_info_modal.modal('hide');show_tip('修改成功');}}});});/**Socket**/var socket=io('http://'+DOMAIN);socket.on('change_status',function(data){console.log(data);change_status(data);});socket.on('current_list',function(data){list_add_row(data);});socket.on('modify_info',function(data){list_modify_info(data);});socket.on('change_avatar',function(data){list_change_avatar(data);});socket.on('receive_message',function(data){dialog_add_row(data);});socket.on('is_online',function(data){socket.emit('online',{});});/**Send Message**/$(function(){var $dialog_submit_button=$('#dialog-submit-button');var $dialog_textarea=$('#dialog-textarea');var $message_length_span=$('#message-length-span');$dialog_submit_button.click(function(event){event.preventDefault();send_message();});$dialog_textarea.keydown(function(event){if(event.which===13){event.preventDefault();send_message();}});function send_message(){var message=new Message($dialog_textarea.css('fontFamily'),$dialog_textarea.css('fontWeight'),$dialog_textarea.css('fontSize'),$dialog_textarea.val());socket.emit('send_message',message);$dialog_textarea.val('');$message_length_span.text('0/'+MESSAGE_MAX_LENGTH);$dialog_submit_button.attr('disabled','disabled');}});function show_error_modal(){var $offline_modal=$('#offline-modal');$offline_modal.modal('show');}/**
 * <div class="table-row-display online-person">
 <div class="table-cell-display list-avatar-div"><img src="images/avatar.png" alt="avatar" class="list-avatar img-circle rotate">
 </div>
 <div class="table-cell-display list-nickname">°若灵™</div>
 <div class="table-cell-display list-status"><span class="glyphicon glyphicon-ok"></span></div>
 </div>
 * **///{account, nickname, age, gender, status, customize_avatar}
function list_add_row(info_obj){var $list_table=$('#list-table');var account=info_obj.account,nickname=info_obj.nickname,age=info_obj.age,gender=info_obj.gender,status=info_obj.status,customize_avatar=info_obj.customize_avatar;if(!$('#'+account).length){var avatar=customize_avatar?account:'avatar';var file_type='';var _iteratorNormalCompletion8=true;var _didIteratorError8=false;var _iteratorError8=undefined;try{for(var _iterator8=ALLOW_FILE_TYPES[Symbol.iterator](),_step8;!(_iteratorNormalCompletion8=(_step8=_iterator8.next()).done);_iteratorNormalCompletion8=true){var file_t=_step8.value;if(is_existent('images/avatars/'+avatar+'.'+file_t)){file_type=file_t;break;}}}catch(err){_didIteratorError8=true;_iteratorError8=err;}finally{try{if(!_iteratorNormalCompletion8&&_iterator8.return){_iterator8.return();}}finally{if(_didIteratorError8){throw _iteratorError8;}}}$list_table.append('\n\t<div class="table-row-display online-person" id='+account+'>\n <div class="table-cell-display list-avatar-div"><img src="images/avatars/'+avatar+'.'+file_type+'" alt="avatar" class="list-avatar img-circle rotate" id='+account+'_avatar>\n </div>\n <div class="table-cell-display list-nickname" id='+account+'_nickname>'+nickname+'</div>\n <div class="table-cell-display list-status"><span class="glyphicon '+Object.values(STATUS_ICONS)[status]+'" id="'+account+'_status"></span></div>\n </div>\n\t');popover_by_id([account+'_avatar'],'<span class="glyphicon glyphicon-user"></span> \u8D26\u53F7\uFF1A'+account+'<br/>\n<span class="glyphicon glyphicon-heart"></span> \u6635\u79F0\uFF1A'+nickname+'<br/>\n<span class="glyphicon glyphicon-globe"></span> \u5E74\u9F84\uFF1A'+age+'<br/>\n<span class="glyphicon glyphicon-leaf"></span> \u6027\u522B\uFF1A'+(gender?'男':'女'),'<span class="glyphicon glyphicon-info-sign"></span>  \u7528\u6237\u4FE1\u606F','right',true);}}//{account}
function list_remove_row(info_obj){var account=info_obj.account;var $account=$('#'+account);if(!$account.length)get_list();$account.remove();}//{account}
function list_change_avatar(info_obj){var file_type='';var account=info_obj.account;var _iteratorNormalCompletion9=true;var _didIteratorError9=false;var _iteratorError9=undefined;try{for(var _iterator9=ALLOW_FILE_TYPES[Symbol.iterator](),_step9;!(_iteratorNormalCompletion9=(_step9=_iterator9.next()).done);_iteratorNormalCompletion9=true){var file_t=_step9.value;if(is_existent('images/avatars/'+account+'.'+file_t)){file_type=file_t;break;}}}catch(err){_didIteratorError9=true;_iteratorError9=err;}finally{try{if(!_iteratorNormalCompletion9&&_iterator9.return){_iterator9.return();}}finally{if(_didIteratorError9){throw _iteratorError9;}}}if(file_type===''){report('\u8D26\u53F7'+account+'\u5934\u50CF\u4E22\u5931');return;}$('#'+account+'_avatar').attr('src','images/avatars/'+account+'.'+file_type+'?'+Date.now());}//{account}
function change_status(info_obj){var account=info_obj.account,status=info_obj.status;if(parseInt(status)===OFFLINE){list_remove_row(info_obj);return;}else if(parseInt(status)===ONLINE||parseInt(status)===LEAVE){list_add_row(info_obj);}var status_icon_span=$('#'+account+'_status');status_icon_span.removeAttr('class');status_icon_span.addClass('glyphicon').addClass(Object.values(STATUS_ICONS)[parseInt(status)]);}//{account, nickname, age, gender}
function list_modify_info(info_obj){var account=info_obj.account,nickname=info_obj.nickname,age=info_obj.age,gender=info_obj.gender;if(!$('#'+account).length)get_list();$('#'+account+'_nickname').text(nickname);modify_popover_content_by_id([account+'_avatar'],'<span class="glyphicon glyphicon-user"></span> \u8D26\u53F7\uFF1A'+account+'<br/>\n<span class="glyphicon glyphicon-heart"></span> \u6635\u79F0\uFF1A'+nickname+'<br/>\n<span class="glyphicon glyphicon-globe"></span> \u5E74\u9F84\uFF1A'+age+'<br/>\n<span class="glyphicon glyphicon-leaf"></span> \u6027\u522B\uFF1A'+(gender?'男':'女'));}/**
 * <div class="table-row-display message-row">
 <div class="table-cell-display message-avatar-div middle">
 <img src="images/avatars/avatar.png" alt="avatar" class="message-avatar img-circle">
 </div>
 <div class="table-cell-display message-nickname middle">°若灵™</div>
 <span class="table-cell-display middle colon">:</span>
 <div class="table-cell-display message middle">
 哈哈哈哈
 </div>
 <div class="table-cell-display message-time middle">17点07分</div>
 </div>
 * **/function dialog_add_row(message_obj){var $message_table=$('#message-table');var $dialog_area=$('#dialog-area');var account=message_obj.account,nickname=message_obj.nickname,font=message_obj.font,bold=message_obj.bold,font_size=message_obj.font_size,content=message_obj.content,send_time=message_obj.send_time;var style='font-family:'+font+';font-weight:'+bold+';font-size:'+font_size;var file_type='';var has_avatar=false;var _iteratorNormalCompletion10=true;var _didIteratorError10=false;var _iteratorError10=undefined;try{for(var _iterator10=ALLOW_FILE_TYPES[Symbol.iterator](),_step10;!(_iteratorNormalCompletion10=(_step10=_iterator10.next()).done);_iteratorNormalCompletion10=true){var file_t=_step10.value;if(is_existent('images/avatars/'+account+'.'+file_t)){file_type=file_t;has_avatar=true;break;}}}catch(err){_didIteratorError10=true;_iteratorError10=err;}finally{try{if(!_iteratorNormalCompletion10&&_iterator10.return){_iterator10.return();}}finally{if(_didIteratorError10){throw _iteratorError10;}}}var img_src=has_avatar?'images/avatars/'+account+'.'+file_type:'images/avatars/avatar.png';$message_table.append('<div class="table-row-display message-row">\n <div class="table-cell-display message-avatar-div middle">\n <img src='+img_src+' alt="avatar" class="message-avatar img-circle">\n </div>\n <div class="table-cell-display message-nickname middle">'+nickname+'</div>\n <span class="table-cell-display middle colon">:</span>\n <div class="table-cell-display message middle" style="'+style+'">'+content+'</div>\n <div class="table-cell-display message-time middle">'+send_time+'</div>\n </div>');$dialog_area.animate({scrollTop:$message_table.height()},500);}/**Online/Offline switch**/window.onunload=function(){switch_status_to(OFFLINE,false);socket.close();};$(function(){switch_status_to(ONLINE);});