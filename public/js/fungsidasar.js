var genapganjil=1;
var bcground='tutupan';
var stsbrowse=false;
var activebrowse='__ajaxbrowse';
var idyangdibuka="";
var nilaivalidate="";
var paramkirim="";
var statuseventnextnormal=true;
var vardownload;
var vartombolperantara;
var varnamikelas; 

function setdatepicker(id){
	$("#"+id+" input").val(datenowserver);
	$("#"+id+" input").datepicker({
		dateFormat : formattgl,
		format : formattgl,
	});
	$("#"+id+" .add-on").click(function(){
		$("#"+id+" input").datepicker("show");
	});
}

function renderkelainan(me){
	var form = $(me).attr('form-render');
	var gets = $('#'+form+' input[with-text]');
	if($(me).val() == 1){
		for (var i of gets){
			$('#'+form+' [name='+i.name+'kelainan]').css("display", "block");
			$("#"+form+" input[name="+i.name+"][value=2]").prop("checked", true);
		}
	}else{
		for (var i of gets){
			$('#'+form+' [name='+i.name+'kelainan]').css("display", "none");
			$("#"+form+" input[name="+i.name+"][value=1]").prop("checked", true);
		}
	}
}

function setdatepickerall(){
	var dts = $(".inputtgl");
	for(var i of dts){
		var el = $(i);
		if(el.attr('readonly') || el.prop('disabled'))
			continue;
		el.datepicker({
			autoclose: true,
			format : formattgl,
		});
	}

	$('.add-on').click(function(){
		var el = $(this).siblings(".inputtgl")
		if(el.attr('readonly') || el.prop('disabled'))
			return false
		el.datepicker("show");
	});
}

function setSelectAll(){
	var dts = $("select.select2browse");
	for(var i of dts){
		var el = $(i);
		var url = el.attr('data-data');
		var placeholder = el.attr('placeholder');
		el.select2({
			placeholder: placeholder,
			allowClear: true,
			minimumInputLength: 0,
			width : '100%',
			theme: 'bootstrap',
			ajax: {
				url: (service.ip || '').replace(/\/+$/gm,'') + ':' + service.port + '/' + url.replace(/\/+$/gm,''),
				dataType: 'json',
				quietMillis: 100,
				type: 'POST',
				beforeSend: function(xhr) {
					if(token)
						xhr.setRequestHeader("Authorization", "Basic " + atob(token));
					if(urlbase)
						xhr.setRequestHeader("urlbase", urlbase);
				},
				data: function (term) {
					return {
						term: term.term ? term.term.toLowerCase() : ''
					};
				},
				processResults: function (data) {
					var results = [];
					$.each(data, function(index, item){
						var opt = {
							id: item.value,
							text: item.label
						}
						var keys = Object.keys(item);
						keys.splice(keys.indexOf('value'), 1);
						keys.splice(keys.indexOf('label'), 1);
						for(var k of keys){
							opt[k] = item[k];
						}
						results.push(opt);
					});
					return {
						results: results
					};
				}, 
			}
		});
	}
}

function setSelect2(id,placeholderinfo,widthinfo,target,mininput){
	$('#'+id).select2({
		placeholder: placeholderinfo,
		allowClear: true,
		minimumInputLength: mininput,
		width : widthinfo,
		ajax: {
			url: urlbase+target,
			dataType: 'json',
			quietMillis: 100,
			type : metodekirim,
			data: function (term) {
				return {
					term: term.toUpperCase()
				};
			},
			results: function (data) {
				var results = [];
				$.each(data, function(index, item){
					results.push({
						id: item.value,
						text: item.label
					});
				});
				return {
					results: results
				};
			}, 
		}
	});
}

function downloadURL(url,filename){
	if(!vardownload){
		vardownload = document.createElement('a');
	}
	vardownload.href= url;
	vardownload.download=filename;
	document.body.appendChild(vardownload);
	vardownload.click();
}

function sendajaxauto(target,req,res){
	$.ajax({
		url: urlbase+target,
		type: metodekirim,
		dataType: 'json',
		data: {term: req.term.toUpperCase(),}
	}).done(res);
}

function sendajax(target,req){
	return $.ajax({
		url: urlbase+target,
		type: metodekirim,
		dataType: 'json',
		data: req
	});
}

function sendajaxhtml(target,req){
	return $.ajax({
		url: urlbase+target,
		type: metodekirim,
		data: req
	});  
}

function sendService(target, req){

	var fd = req instanceof FormData;

	if(!fd && typeof req == 'object'){
		var dm = req;
		for(var i of Object.keys(dm)){
			req += (req ? '&' : '') + i + '=' + dm[i]
		}
	}

	var ajx = {
		type: 'POST',
		url: (service.ip || '').replace(/\/+$/gm,'') + ':' + service.port + '/' + target.replace(/^\/+|\/+$/gm,''),
		data: req,
		beforeSend: function(xhr) {
			if(token)
				xhr.setRequestHeader("Authorization", "Basic " + atob(token));
		},
		success: (data) => {
		},
		error: (xhr, status, error) => {
			getNewIP(service, target, req);
		}
	};

	if(fd){
		ajx.enctype = 'multipart/form-data';
		ajx.cache = false;
		ajx.contentType = false;
		ajx.processData = false;
	}

	return $.ajax(ajx).then(r => {
		return JSON.parse(r);
	});
}

function sendLocalService(target, req){

	if(req == 'object'){
		var dm = req;
		for(var i of Object.keys(dm)){
			req += (req ? '&' : '') + i + '=' + dm[i]
		}
	}

	var ajx = {
		type: 'POST',
		url: urlbase + target,
		data: req,
		success: (data) => {
			console.log('request success...');
		},
		error: (xhr, status, error) => {
			console.log('request error...');
		}
	};

	return $.ajax(ajx).then(r => {
		return JSON.parse(r);
	});
}

function sendServicejsonp(target, req, jsonp = false){

	if(!service)
		console.log('no IP available');

	var fd = req instanceof FormData;
	jsonp = jsonp && !fd ? true : false;

	if(!fd && typeof req == 'object'){
		var dm = req;
		req = '';
		for(var i of Object.keys(dm)){
			req += (req ? '&' : '') + i + '=' + dm[i]
		}
	}

	var ajx = {
		type: 'POST',
		enctype: 'multipart/form-data',
		url: (service.ip || '').replace(/\/+$/gm,'') + ':' + service.port + '/' + target.replace(/^\/+|\/+$/gm,'') + ((jsonp) ? '?callback=?&jsonp=true' : ''),
		data: req,
		processData: false,
		contentType: false,
		cache: false,
		success: (data) => {
			console.log('request success...');
		},
		error: (xhr, status, error) => {
			getNewIP(service, target, req);
		}
	};

	if(jsonp)
		ajx.dataType = 'json';

	return $.ajax(ajx);
}

function getNewIP(oservice, target, req){
	var err = false;
	$.ajax({
		url: urlbase + 'c/sys/setnewip',
		type: 'POST',
		dataType: 'json',
		data: oservice,
	}).done(r => {
		service = r;
	});
}

function sendfile(target,files,param){
	var formData = new FormData();
	if(files!=undefined){
		if(Array.isArray(files)){
			for(k in files){
				formData.append(files[k].id, files[k].file, files[k].file.name);
			}
		} else formData.append("file", files, files.name);
	}
	if(param!=undefined){
		if(typeof param=="string"){
			param = param.split("&");
			for(k in param){
				paramandvalueform = param[k].split("=");
				formData.append(paramandvalueform[0],paramandvalueform[1]);
			}
		} else {
			for(k in param){
				formData.append(k,param[k]);  
			}  
		}

	}
	return $.ajax({
		type: "POST",
		url: urlbase+target,
		async: true,
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		dataType: 'json',
		timeout: 60000
	});
}

function showTooltip(x, y, contents) {
	$('<div id="tooltip">' + contents + '</div>').css({
		position: 'absolute',
		display: 'none',
		top: y + 5,
		left: x + 15,
		border: '1px solid #333',
		padding: '4px',
		color: '#fff',
		'border-radius': '3px',
		'background-color': '#333',
		opacity: 0.80
	}).appendTo("body").fadeIn(200);
}

var previousPoint = null;
function bindplothover(id){
	$("#"+id).bind("plothover", function (event, pos, item) {
		$("#x").text(pos.x.toFixed(2));
		$("#y").text(pos.y.toFixed(2));

		if (item) {
			if (previousPoint != item.dataIndex) {
				previousPoint = item.dataIndex;

				$("#tooltip").remove();
				var x = item.datapoint[0].toFixed(2),
				y = item.datapoint[1],
				labelx = item.series.data[item.dataIndex][2];
				showTooltip(item.pageX, item.pageY, item.series.label + " tgl " + labelx + " :  " + y);
			}
		} else {
			$("#tooltip").remove();
			previousPoint = null;
		}
	});
}

function setphone(id,target,desc,mininput,sdaftar){
	$('#'+id).select2({
		placeholder: "Pilih "+desc,
		allowClear: true,
		minimumInputLength : mininput,
		ajax: {
			url: urlbase+target,
			dataType: 'json',
			quietMillis: 100,
			data: function (term) {
				return {
					term: term.toUpperCase(),
					statusdaftar : status
				};
			},
			results: function (data) {
				var results = [];
				$.each(data, function(index, item){
					results.push({
						id: item.value,
						text: item.label,
						atasnama : item.atasnama
					});
				});
				return {
					results: results
				};
			}
		},
	});
}

function setdd(id,target,desc,mininput){
	$('#'+id).select2({
		placeholder: "Pilih "+desc,
		allowClear: true,
		minimumInputLength : mininput,
		ajax: {
			url: urlbase+target,
			dataType: 'json',
			quietMillis: 100,
			data: function (term) {
				return {
					term: term.toUpperCase()
				};
			},
			results: function (data) {
				var results = [];
				$.each(data, function(index, item){
					results.push({
						id: item.value,
						text: item.label
					});
				});
				return {
					results: results
				};
			}
		},
	});
}

function setlov(id,lov, desc){
	$('#'+id).select2({
		placeholder: "Pilih "+desc,
		allowClear: true,
		ajax: {
			url: urlbase+"lov",
			dataType: 'json',
			quietMillis: 100,
			data: function (term) {
				return {
					term: lov
				};
			},
			results: function (data) {
				var results = [];
				$.each(data, function(index, item){
					results.push({
						id: item.value,
						text: item.label
					});
				});
				return {
					results: results
				};
			}
		},
	});
}

function formatrebuan(eusi){
	eusi = parseInt(eusi);
	eusi = eusi+"";
	panjangstr=(eusi).length-1;
	ribuan=1;
	akhirna="";
	while(panjangstr>=0){
		if(ribuan%3==0 && panjangstr!=0){
			akhirna = ','+eusi[panjangstr]+akhirna;
		} else {
			akhirna = ""+eusi[panjangstr]+akhirna;
		}
		ribuan++;
		panjangstr--;
	}
	if(akhirna==NaN){akhirna=0;}
	return(akhirna);
}

function tesjs(frmname,insts){
	stsbrowse=insts;
	if(genapganjil==1){
		$(frmname).fadeIn(300);
		popMargTop = ($(frmname).height() + 24) / 2; 
		popMargLeft = ($(frmname).width() + 24) / 2;
		$(frmname).css({ 
			'margin-top' : -popMargTop,
			'margin-left' : -popMargLeft
		});
		$('body').append('<div id="'+bcground+'"></div>');
		$('#'+bcground).fadeIn(300);
		genapganjil=0;
	} else {
		$(frmname).fadeOut(300);
		$('#'+bcground).fadeOut(300);
		$('#'+bcground).remove();
		genapganjil=1;
	}
}

function prosescetak(mode,target,saatos,param){
	var form = document.createElement("form");
	form.setAttribute("method", metodekirim);
	form.setAttribute("action","cetakutama.php");

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", 'target');
	hiddenField.setAttribute("value", target);
	form.appendChild(hiddenField);

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", 'saatos');
	hiddenField.setAttribute("value", saatos);
	form.appendChild(hiddenField);

	temparr = param.split(",");
	for (i = 0 ; i < temparr.length ; i ++)
	{
		row = temparr[i].split("=>");
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", row[0]);
		hiddenField.setAttribute("value", row[1]);
		form.appendChild(hiddenField);
	}
	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "mode");  
	if(mode){
		form.setAttribute("target", "_blank");
		hiddenField.setAttribute("value", 1);
	} else {
		hiddenField.setAttribute("value", 0);
	}
	form.appendChild(hiddenField);

	document.body.appendChild(form);
	form.submit();
}

function prosesmenuaksi(arrin,state,param){
	i=1;
	while(i<arrin.length){
		eusi = arrin[i].split(":");
		param+=","+eusi[0]+"=>"+eusi[1];
		i++;
	}
	param+=",stform=>"+state;
	prosesmenu(param);
}

function prosesmenu(link, param, istarget){
	form = document.createElement("form");
	form.setAttribute("method", metodekirim);
	form.setAttribute("action",link);

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "cookiesc");
	if($.cookie('style_color')==undefined)
	{ 
		$.cookie('style_color','default');
	}
	hiddenField.setAttribute("value", $.cookie('style_color'));
	form.appendChild(hiddenField);

	if(istarget)
		form.setAttribute("target", "_blank");
	if(param.indexOf(',')!=-1){
		temparr = param.split(",");
		for (i = 0 ; i < temparr.length ; i ++)
		{
			row = temparr[i].split("=>");
			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", row[0]);
			hiddenField.setAttribute("value", row[1]);
			form.appendChild(hiddenField);
		}
	} else {
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "idm");
		hiddenField.setAttribute("value", param);
		form.appendChild(hiddenField);
	}
	document.body.appendChild(form);
	form.submit();
}

function prosesLogout(){
	var form = document.createElement("form");
	form.setAttribute("method", metodekirim);
	if (window.confirm("Anda yakin ingin Logout?")){
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "idproses");
		hiddenField.setAttribute("value", "logout");
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		form.submit();        
	}
}

function setFocusBrws(elemnt){
	$("#"+elemnt).val(".");
	$("#"+elemnt).focus();
	$('div.dataTables_filter input').focus();
}

function setNilai(id,values,validate){
	$('#'+id+"browsehid").val(values[0]);
	$('#'+id+"browse").val(values[0]);
	$('#'+id+"browse_label").text(values[1]);
	if(validate){
		nilaivalidate = values;
		eval(validate+"();");
	}
	tutupBrowse();
	$(":input").get($(":input").index($('#'+id+"browse"))+1).focus();
	nilaivalidate="";
}

function tutupBrowse(){
	$('#'+bcground).fadeOut(300);
	$('#'+bcground).remove();
	$('#'+activebrowse).remove();
	stsbrowse=false;
	idyangdibuka="";
}

function setAksiDefault(arrid,jenis,target){
	var form = document.createElement("form");
	form.setAttribute("method", metodekirim);

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "idfrview");
	hiddenField.setAttribute("value", target);
	form.appendChild(hiddenField);
	document.body.appendChild(form);
	i=1;
	while(i<arrid.length){
		eusi = arrid[i].split(":");
		hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", eusi[0]);
		hiddenField.setAttribute("value", eusi[1]);
		form.appendChild(hiddenField);
		document.body.appendChild(form);
		i++;
	}
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "stform");
	hiddenField.setAttribute("value", jenis);
	form.appendChild(hiddenField);
	document.body.appendChild(form);
	form.submit();
}

var hasil="";
var hasilsat="";
var idproseshitung=0;
function prosesEtang(arrin){
	if(!arrin.hasOwnProperty('akhirproses')) arrin['akhirproses']='gentosBiaya';
	$.ajax({type: metodekirim,
		url: "tonggoh/hitungtarif.php",
		data: "datajson="+JSON.stringify(arrin),
		success: function(rsp){
			temp = rsp.split('|');
			hasil = temp[0];
			hasilsat = temp[1];
			eval(arrin['akhirproses']+"()");
		},
		error: function(rsp) {alert("error system");console.log(rsp);}
	});

	// arrin['pengali']='B';
	// arrin['qty']=1;
	// $.ajax({type: metodekirim,
	// 	url: "tonggoh/hitungtarif.php",
	// 	data: "datajson="+JSON.stringify(arrin),
	// 	success: function(rsp){hasilsat= rsp;eval(arrin['akhirproses']+"()");},
	// 	error: function(rsp) {alert("error system");console.log(rsp);hasilsat=rsp;eval(arrin['akhirproses']+"()");}
	// });

    //JQuery.parseJSON(jsonvalue);
    return hasil;
}

function candakBiayaTindakan(arrin){
	arrin['tipe']='Tindakan';
	return prosesEtang(arrin);
}

function candakHJO(arrin){
	arrin['tipe']='HJO';
	return prosesEtang(arrin);
}

function kapitalkeunsadaya(){
	$(":input").each(function(){
		if($(this).attr("name")!='stform' & $(this).attr("name")!='idproses')
			$(this).val($(this).val().toUpperCase());
	});
}

function getallinputmsg(){
	valinput = "";
	$(":input").each(function(){
		if($(this).attr("name")!=undefined){
			if($(this).hasClass("inputangka")){
				tval = $(this).val().trim(); 
				while(tval.search(",")!=-1){
					tval = tval.replace(",","");
				}
				valinput += $(this).attr("name")+"="+tval+"&";
			} else {
				valinput += $(this).attr("name")+"="+$(this).val()+"&";
			}
		}
	});
	return valinput;
}

function getallinputkapitalmsg(){
	valinput = "";
	$(":input").each(function(){
		if($(this).attr("name")!=undefined){
			if($(this).hasClass("inputangka")){
				tval = $(this).val().trim(); 
				while(tval.search(",")!=-1){
					tval = tval.replace(",","");
				}
				valinput += $(this).attr("name")+"="+tval+"&";
			} else {
				$(this).val($(this).val().toUpperCase());
				valinput += $(this).attr("name")+"="+$(this).val()+"&";
			}
		}
	});
	return valinput;
}

function datatablesAjax(param){
	idtables = param[0];
	target = param[1];
	definisikolom = param[2];
	temp = $("#"+idtables).dataTable({
		"sPaginationType": "full_numbers",
		"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
		"bProcessing": true,
		"bServerSide": true,
		"sAjaxSource" : urlbase+target,
		"sServerMethod" : metodekirim,
		"aoColumnDefs": definisikolom,
		"oLanguage": {
			"sLengthMenu": "_MENU_ &nbsp;&nbsp;baris per halaman",
			"sZeroRecords": "Data Kosong",
			"sInfo": "Menampilkan _START_ s/d _END_ dari _TOTAL_ data",
			"sInfoEmpty": "data tidak ditemukan",
			"sInfoFiltered": "(dari total _MAX_ data)"
		}
	});
	$('.dataTables_filter input').focus();
	return temp;

	// $("#tabeldata").dataTable({
	// 	"language": {
	// 		"lengthMenu": "Display _MENU_ records per page",
	// 		"zeroRecords": "Nothing found - sorry",
	// 		"info": "Showing page _PAGE_ of _PAGES_",
	// 		"infoEmpty": "No records available",
	// 		"infoFiltered": "(filtered from _MAX_ total records)"
	// 	}
	// } );

}

function setKelasKhususAngka(namikelas){
	$("."+namikelas).keypress(function(){
		evt = window.event;
		charCode = (evt.which) ? evt.which : evt.keyCode;
		if(charCode>31 && (charCode<48 || charCode >57)){
			return false;
		}
		return true;
	});
}

function setClassNavigasi(namikelas,tombolperantara){
	$(namikelas).unbind('keyup',setNavForGoToNextInput);
	vartombolperantara = tombolperantara;
	varnamikelas= namikelas;
	$(namikelas).bind('keyup',setNavForGoToNextInput);
}

function setNavForGoToNextInput(e){
	switch(e.which)
	{
		case vartombolperantara: if(statuseventnextnormal){nextInputan(varnamikelas);} else {statuseventnextnormal=true;}
		break;
	}
}

function nextInputan(kelasinputan){
	ditemukan = false;
	$(kelasinputan).each(function(){
		if($(this).attr("name")!=undefined){
			if(ditemukan){
				if($(this).hasClass('listselect')){
					$(this).select2("open");
				}
				$(this).focus();
				if(!$(this).attr('disabled')){
					return false;
				}
			} else {
				if($(this).attr("name")==$(document.activeElement).attr("name")){
					ditemukan=true;
				}
			}
		}
	});
}

function nextInputanSaatos(kelasinputan,nami){
	ditemukan = false;
	$(kelasinputan).each(function(){
		if($(this).attr("name")!=undefined){
			if(ditemukan){
				if($(this).hasClass('listselect')){
					$(this).select2("open");
				}
				$(this).focus();
				statuseventnextnormal=false;
				return false;
			} else {
				if($(this).attr("name")==nami){
					ditemukan=true;

				}
			}
		}
	});
}

function getAngkaTiKoma(tval){
	tval = tval.trim(); 
	return tval.split(",").join("");
}

function nextInputEnter(e,nextid){
	if(e.which==13 && $(e.target).val()!=""){
		$("#"+nextid).focus().select();
	}
}

function pilihCRadio(value,listid){
	cnti = 0;
	while(cnti<listid.length){
		if($("#"+listid[cnti]).val()==value){
			$("#uniform-"+listid[cnti]+" span").addClass("checked");
			$("#"+listid[cnti]).prop("checked",true);
		} else {
			$("#uniform-"+listid[cnti]+" span").removeClass("checked");
		}
		cnti++;
	}
}


////////////////////// MENU UTMA /////////////////////////

$(function() {
	$('#side-menu').metisMenu();
});

$(function() {
	$(window).bind("load resize", function() {
		width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
		if (width < 768) {
			$('div.sidebar-collapse').addClass('collapse')
		} else {
			$('div.sidebar-collapse').removeClass('collapse')
		}
	})
})

// ###########

var pluginName = "metisMenu",
defaults = {
	toggle: true
};

function Plugin(element, options) {
	this.element = element;
	this.settings = $.extend({}, defaults, options);
	this._defaults = defaults;
	this._name = pluginName;
	this.init();
}

Plugin.prototype = {
	init: function () {

		var $this = $(this.element),
		$toggle = this.settings.toggle;

		$this.find('li.active').has('ul').children('ul').addClass('collapse in');
		$this.find('li').not('.active').has('ul').children('ul').addClass('collapse');
		$this.find('li').has('ul').children('a').on('click', function (e) {
			e.preventDefault();
			$(this).parent('li').toggleClass('active').children('ul').collapse('toggle');
			if ($toggle) {
				$(this).parent('li').siblings().removeClass('active').children('ul.in').collapse('hide');
			}
		});
	}
};

$.fn[ pluginName ] = function (options) {
	return this.each(function () {
		if (!$.data(this, "plugin_" + pluginName)) {
			$.data(this, "plugin_" + pluginName, new Plugin(this, options));
		}
	});
};

function tutupbukainput(){
	if($("#prosesajaxserial").html()==undefined){
		$("body").append("<div id='prosesajaxserial' style='position:fixed;left: 0;top: 0;height: 100%;width: 100%;opacity:0.4;z-index:800'><img src='"+urlbase+"resources/images/loading.gif' style='height:100%;width:100%;'></div>");
	} else {
		if($("#prosesajaxserial").is(":visible")){
			$("#prosesajaxserial").hide(); 
		} else {
			$("#prosesajaxserial").show();  
		}
	}  
}

function setMask(){
	$(".inputangka").inputmask({alias: "numeric", 'groupSeparator': ',', 'autoGroup': true, 'digitsOptional': true});
	$(".inputtgl").inputmask({alias: "dd-mm-yyyy"});
	$(".inputangkaaj").inputmask({alias: "numeric", 'groupSeparator': '', 'autoGroup': true, 'digitsOptional': true});
	$(".inputtelp").inputmask({"mask": "9999-9999-9999"});
}

function datedbtoview(dt){
	if(!dt)
		return null;

	var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
	return dt.replace(pattern,'$3-$2-$1');
}


function setSelectwilayah(url,name){
	if(name && url){
			var dts = $("select.select2wilayah[name="+name+"]" );

			for(var i of dts){
				var el = $(i);
				var url = url
				var placeholder = el.attr('placeholder');
				el.select2({
					placeholder: placeholder,
					allowClear: true,
					minimumInputLength: 0,
					width : '100%',
					theme: 'bootstrap',
					ajax: {
						url: (service.ip || '').replace(/\/+$/gm,'') + ':' + service.port + '/' + url.replace(/\/+$/gm,''),
						dataType: 'json',
						quietMillis: 100,
						type: 'POST',
						beforeSend: function(xhr) {
							if(token)
								xhr.setRequestHeader("Authorization", "Basic " + atob(token));
							if(urlbase)
								xhr.setRequestHeader("urlbase", urlbase);
						},
						data: function (term) {
							return {
								term: term.term ? term.term.toLowerCase() : ''
							};
						},
						processResults: function (data) {
							var results = [];
							$.each(data, function(index, item){
								var opt = {
									id: item.value,
									text: item.label
								}
								var keys = Object.keys(item);
								keys.splice(keys.indexOf('value'), 1);
								keys.splice(keys.indexOf('label'), 1);
								for(var k of keys){
									opt[k] = item[k];
								}
								results.push(opt);
							});
							return {
								results: results
							};
						}, 
					}
				});
			}

		}else {
			var dts = $("select.select2wilayah");
			for(var i of dts){
				var el = $(i);
				var url = url
				var placeholder = el.attr('placeholder');
				el.select2({
					placeholder: placeholder,
					allowClear: true,
					minimumInputLength: 0,
					width : '100%',
					theme: 'bootstrap',
			})
			}
			if(name){
				var dts = $("select.select2wilayah[name="+name+"]")
				for(var i of dts){
					var el = $(i);
					var url = el.attr('data-data');
					var placeholder = el.attr('placeholder');
					el.select2({
						placeholder: placeholder,
						allowClear: true,
						minimumInputLength: 0,
						width : '100%',
						theme: 'bootstrap',
						ajax: {
							url: (service.ip || '').replace(/\/+$/gm,'') + ':' + service.port + '/' + url.replace(/\/+$/gm,''),
							dataType: 'json',
							quietMillis: 100,
							type: 'POST',
							beforeSend: function(xhr) {
								if(token)
									xhr.setRequestHeader("Authorization", "Basic " + atob(token));
								if(urlbase)
									xhr.setRequestHeader("urlbase", urlbase);
							},
							data: function (term) {
								return {
									term: term.term ? term.term.toLowerCase() : ''
								};
							},
							processResults: function (data) {
								var results = [];
								$.each(data, function(index, item){
									var opt = {
										id: item.value,
										text: item.label
									}
									var keys = Object.keys(item);
									keys.splice(keys.indexOf('value'), 1);
									keys.splice(keys.indexOf('label'), 1);
									for(var k of keys){
										opt[k] = item[k];
									}
									results.push(opt);
								});
								return {
									results: results
								};
							}, 
						}
					});
				}
			}
		}
	}
