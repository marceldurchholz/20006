// MyProfileNestedView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/MyProfileNestedViewPage.html"],

    function($, Backbone, sidemenusList, SidemenuView, MyProfileNestedViewPage){
		
		var MyProfileNestedView = Backbone.View.extend({
			el: "#MyProfileNestedViewDiv",
			initialize: function() {
				var _thisViewMyProfileNested = this;
				// console.log('initializing MyProfileNestedView.js');
				_thisViewMyProfileNested.$el.hide();
				showModal();
				// _thisViewMyProfileNested.me = window.me;
				_thisViewMyProfileNested.initialized = window.me;
				// dpd.users.me(function(me) {
				dpd('users').get(window.system.uid, function(me, err) {
					if (me) { 
						_thisViewMyProfileNested.me = me;
					}
					else {
						system.redirectToUrl('#login');
						return(false);
					}
					// console.log(me);
					
					$.ajax({
						url: "http://dominik-lohmann.de:5000/users",
						async: false
					}).done(function(users) {
						var logincounts = 0;
						_.each(users, function(user) {
							if (user.logincount==undefined) user.logincount = 0;
							logincounts += user.logincount;
						});
						_thisViewMyProfileNested.me.level = Math.round(3*(window.me.logincount/logincounts),0);
						// alert(_thisViewMyProfileNested.me.level);
					});
					
					$.ajax({
						url: "http://dominik-lohmann.de:5000/interests",
						async: false
					}).done(function(interests) {
						_.each(interests, function(interest) {
							var exists = $.inArray( $.trim(interest.name), _thisViewMyProfileNested.me.interests );
							if (exists>-1) interest.checked = "checked";
						});
						interests.sort(function(a, b){
						 var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
						 if (nameA < nameB) //sort string ascending
						  return -1 
						 if (nameA > nameB)
						  return 1
						 return 0 //default return value (no sorting)
						});
						_thisViewMyProfileNested.interests = interests;
						_thisViewMyProfileNested.render();
						// _thisViewMyProfileNested.checkActiveStatus();
					});
					// if (_thisViewMyProfileNested.me.active==false || $("#fullname").val()=='') {
					/*
					if ($("#fullname").val()=='') {
						// doAlert('Bitte vervollständigen Sie Ihr Profil und bestätigen Sie Ihre E-Mail-Adresse über den zugesendeten Link.','Fast fertig...');
						doAlert('Bitte hinterlegen Sie Ihren Namen zur Freischaltung.','Fast fertig...');
					}
					*/
					
				});

			},
			fetch: function() {	
				_thisViewMyProfileNested = this;
				// console.log('fetching MyProfileNestedView.js');
			},
			changeInputValue: function(e) {
				/*
				console.log(e);
				console.log(e.currentTarget.id);
				console.log(e.currentTarget.defaultValue);
				console.log(e.currentTarget.value);
				*/
				// dpd.users.me(function(me) {
				dpd('users').get(window.system.uid, function(me, err) {
					_thisViewMyProfileNested.me = me;
				});
				var obj = e.currentTarget;
				if (obj.defaultValue != obj.value) {
					// console.log(_thisViewMyProfileNested.me.id);
					// console.log(obj.id);
					if (obj.id=='username') {
						// console.log(checkEmail(obj.value));
						if (checkEmail(obj.value)==true) { }
						else return false;
					}
					var o = new Object();
					o.id = obj.id;
					o.value = obj.value;
					// var newroles = ["user","seeker"];
					// if (obj.id=='fullname') if (obj.value=='') { doAlert('Es muss ein Vor- und Nachname eingegeben werden.','Information'); } else dpd.users.put(_thisViewMyProfileNested.me.id, {"fullname":obj.value, roles: newroles}, function(result, err) { 
					if (obj.id=='fullname') if (obj.value=='') { doAlert('Es muss ein Vor- und Nachname eingegeben werden.','Information'); } else dpd.users.put(_thisViewMyProfileNested.me.id, {"fullname":obj.value}, function(result, err) { 
						if(err) return console.log(err); 
						// console.log(result, result.id); 
						_thisViewMyProfileNested.me = result;
						if (_thisViewMyProfileNested.me.active==false) {
							_thisViewMyProfileNested.activationMessage();
						}
					});
					// if (obj.id=='slogan') dpd.users.put(_thisViewMyProfileNested.me.id, {"slogan":obj.value}, function(result, err) { if(err) return console.log(err); console.log(result, result.id); });
					if (obj.id=='perstext') dpd.users.put(_thisViewMyProfileNested.me.id, {"perstext":obj.value}, function(result, err) { if(err) return console.log(err); /* console.log(result, result.id); */ });
				}
			},
			activationMessage: function() {
				var _thisViewMyProfileNested = this;
				// $('#showMenu').show();
				// $('.showPageOptions').show();
				// $('#restrictedArea').show();
				// console.log(_thisViewMyProfileNested.initialized.active,_thisViewMyProfileNested.me.active);
				// if (_thisViewMyProfileNested.initialized.active != _thisViewMyProfileNested.me.active) {
					doAlert('Ihr Profil wurde freigeschaltet. Diese Seite wurde hierzu neu geladen,','Profil bereit!');
					dpd.users.put(_thisViewMyProfileNested.me.id, {"active":true}, function(result, err) { 
						if(err) return console.log(err); 
						// console.log(result, result.id); 
						// system.redirectToUrl('#logout');
						_thisViewMyProfileNested.initialize();
					});
					// window.location.reload();
				// }
			},
			checkActiveStatus: function() {
				var _thisViewMyProfileNested = this;
				// dpd.users.me(function(me) {
				dpd('users').get(window.system.uid, function(me, err) {
					_thisViewMyProfileNested.me = me;
				});
				if (_thisViewMyProfileNested.me.active==true && _thisViewMyProfileNested.me.fullname!='' && _thisViewMyProfileNested.me.fullname!=undefined) {
					_thisViewMyProfileNested.activationMessage();
				}
				else {
					// doAlert('Um alle Funktionen des APPinaut nutzen zu können, bestätigen Sie bitte Ihre E-Mail-Adresse über den Link in der Ihnen zugestellten E-Mail.','E-Mail-Bestätigung erforderlich');
					// console.log('active still false');
					window.clearTimeout(doid);
					var doid = window.setTimeout("_thisViewMyProfileNested.checkActiveStatus()", 10000);
					/*
					var confirmText = 'Möchten Sie diese jetzt bestätigen? Sie benötigen hierzu eine aktive Internetverbung.';
					var confirmTitle = 'E-Mail-Adresse noch nicht bestätigt';
					var confirmButtonLabels = 'Abbrechen,Bestätigen';
					doConfirm(confirmText, confirmTitle, _thisViewMyProfileNested.confirmMyEmail, confirmButtonLabels);
					*/
				}
			},
			/*
			confirmMyEmail: function(response) {
				console.log(response);
				if (response==2) {
					// system.redirectToUrl('#logout');
					var vurl =  'http://prelaunch002.appinaut.de/secure/external/verify.php?v='+window.me.id;
					// doAlert('Sie werden nun zu folgender Internetdresse weitergeleitet: '+vurl,'Bestätigung/Weiterleitung');
					window.location.href = vurl;
				}
			},
			*/
			bindEvents: function() {
				var _thisViewMyProfileNested = this;
				$('#showPageOptionsIcon').hide();
				$('#delaccuntarea').hide();
				$('#restrictedArea').hide();
				$('#showMenu').hide();
				$('.showPageOptions').hide();
				if (_thisViewMyProfileNested.me.active==true) {
					if ($("#fullname").val()!='') {
						// $('#showPageOptionsIcon').show();
						$('#showMenu').show();
						$('.showPageOptions').show();
						$('#restrictedArea').show();
					}
				}
				// $("#fullname").attr("placeholder","Name erforderlich...");
				
				$("#fullname").blur(this.changeInputValue);
				// $("#slogan").blur(this.changeInputValue);
				$("#perstext").blur(this.changeInputValue);
				// $("#username").blur(this.changeInputValue);
				$("input[type='checkbox']").bind( "change", function(event, ui) {
					event.preventDefault();
					// console.log(event);
					// console.log(event.delegateTarget);
					// console.log(event.delegateTarget.id);
					// console.log( $("label[for='"+ event.delegateTarget.id +"']").text() );
					// console.log(event.delegateTarget.checked);
					var o = new Object();
					o.id = event.delegateTarget.id;
					if (event.delegateTarget.checked==false) o.status = "";
					else o.status = "checked";
					o.label = $("label[for='"+ event.delegateTarget.id +"']").text();					
					// dpd.users.me(function(me) {
					dpd('users').get(window.system.uid, function(me, err) {
						// console.log(me);
						var exists = $.inArray( $.trim(o.label), me.interests )
						// console.log(exists);
						if (event.delegateTarget.checked==false && exists>-1) dpd.users.put(_thisViewMyProfileNested.me.id, {"interests": {$pull:$.trim(o.label)}} );
						else if (event.delegateTarget.checked==true && exists==-1) dpd.users.put(_thisViewMyProfileNested.me.id, {"interests": {$push:$.trim(o.label)}} );
					});
				});
				
				this.$el.off('click','.purchasebtn').on('click','.purchasebtn',function(e){
					e.preventDefault();
					// console.log(e.delegateTarget);
					var iapid = $(this).attr('data-iapid');
					// console.log("purchasing "+iapid);
					// window.storekit.purchase("com.digitalverve.APPinaut."+iapid,1);
					showModal();
					if (isMobile.any()) { 
						window.storekit.purchase(iapid,1);
					}
					else {
						// console.log('window.storekit.purchase not available when not mobile');
						_thisViewMyProfileNested.initialize();
						hideModal();
						
					}
					// window.storekit.purchase("com.digitalverve.APPinaut.250APP359T9", 1);
					// window.storekit.purchase("com.digitalverve.APPinaut.250APP359T9");
				});
				
				this.$el.off('click','#showdeletearea').on('click','#showdeletearea',function(e){
					e.preventDefault();
					$('#delaccuntarea').show();
				});
				this.$el.off('click','#deletemyaccountbtn').on('click','#deletemyaccountbtn',function(e){
					e.preventDefault();
					// _thisViewLogin.sendLogin('#dashboard');
					// console.log('clicked');
					// console.log(e);
					var confirmText = 'Wollen Sie Ihren Zugang wirklich unwiderruflich löschen?';
					var confirmTitle = 'Sind Sie sicher?';
					var confirmButtonLabels = 'Bitte löschen,Vorgang abbrechen';
					doConfirm(confirmText, confirmTitle, _thisViewMyProfileNested.deleteMyAccount, confirmButtonLabels);
				});
				checkTopNaviRoles();
			},
			deleteMyAccount: function(response) {
				// console.log(response);
				if (response==1) {
					doAlert('Das finden wir schade. Ihr Zugang wurde gelöscht. Schauen Sie gerne wieder einmal vorbei.','Auf Wiedersehen :-(');
					var deldate = new Date();
					var deletetedusername = 'DELETETED_'+deldate+'_'+_thisViewMyProfileNested.me.username;
					dpd.users.put(_thisViewMyProfileNested.me.id, {"username":deletetedusername,"deleted":true}, function(result, err) { 
						if(err) return console.log(err); 
						// console.log(result, result.id); 
						system.redirectToUrl('#logout');
					});
				}
			},
			render: function() {
				var _thisViewMyProfileNested = this;
				// console.log('rendering MyProfileNestedView.js');
				
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisViewMyProfileNested.nestedView = new SidemenuView().fetch();

				var htmlContent = '';
				$(this.el).html(htmlContent);
				// console.log(_thisViewMyProfileNested.me);
				if (!_thisViewMyProfileNested.me.credits) _thisViewMyProfileNested.me.credits = "0";
				var provider;
				provider = $.inArray( 'provider', _thisViewMyProfileNested.me.roles );
				var seeker;
				seeker = $.inArray( 'seeker', _thisViewMyProfileNested.me.roles );				
				htmlContent = _.template(MyProfileNestedViewPage, {
					id: _thisViewMyProfileNested.me.id
					, pictureurl: _thisViewMyProfileNested.me.pictureurl
					, fullname: _thisViewMyProfileNested.me.fullname
					, slogan: _thisViewMyProfileNested.me.slogan
					, perstext: _thisViewMyProfileNested.me.perstext
					, username: _thisViewMyProfileNested.me.username
					, credits: _thisViewMyProfileNested.me.credits
					, level: _thisViewMyProfileNested.me.level
					, interests: _thisViewMyProfileNested.interests
					, provider: provider
					, seeker: seeker
				},{variable: 'user'});
				// alert(htmlContent);
				$(this.el).html(htmlContent);
				fontResize();
				hideModal();
				this.$el.trigger('create');
				// new FastClick(document.body);
				this.$el.fadeIn( 500, function() {
					$('.ui-content').scrollTop(0);
					new FastClick(document.body);
				});
				this.bindEvents();
				return(this);
			}
		});

        return MyProfileNestedView;

    }

);