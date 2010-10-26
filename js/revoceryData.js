$(document).ready(function(){

	var hlcolor = '#FFF8C6';
	$.fn.showFields = function(argumento){
		var dep = argumento;
		for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
				$(this).addClass('required');
				});
			if($(dep[div]).css('display') != 'block')
				$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
						});
		}
	}

	$('#autocompletar').click(function(){
		$.ajax({
			type: 'GET',
			url:'cgi-bin/completeForm.py',
			dataType: "xml",
			success: function(xml){
				var elements = xml.getElementsByTagName('consulta')[0].childNodes;
				$(elements).each(function(){
					var el = $(this).get(0);
					if($(el)[0].nodeType == xml.ELEMENT_NODE){
						var tagname = $(el)[0].tagName;
						idDiv = $('#'+tagname).parent().attr('id');
						console.log(tagname + ' : ' + $('#'+tagname).attr('type'));
						var hlcolor = '#FFF8C6';
						//Checkbox
						if (tagname == 'comorbidades')
						{
							$('input[name=comorbidades]').each(function(){
								if ($(el).text().search($(this).val()) != -1)
									$(this).attr('checked',true);
							});
							if ($(el).text().search('nao') != -1)
							{
								$('input[name=comorbidades]').each(function(){
									if ($(this).val() != 'nao')
										$(this).attr('disabled',true);
								});
							}
						}
						if (tagname == 'comorbidadesOutros')
						{
							$('input[name=comorbidadesOutros]').removeAttr('disabled');
							$('input[name=comorbidadesOutros]').val($(this).text());
						}
						if (tagname == 'tratamentoPrescritoTBFarmacos')
						{
							$('input[name=tratamentoPrescritoTBFarmacos]').each(function(){
								if ($(el).text().search($(this).val()) != -1)
									$(this).attr('checked',true);
							});
						}
						if (tagname == 'farmacosOutros')
						{
							$(this).removeAttr('disabled');
							$(this).val($(el).text());
							$('#tratamentoPrescritoTBFarmacos_13').attr('checked',true);
						}
						//Secondary fields
						if ((idDiv == 'divTratamentoPrescritoTBFarmaco') || (idDiv == 'divDataInicio'))
						{
							var dep = new Array();
							dep[0] = '#divDataInicio';
							dep[1] = '#divTratamentoPrescritoTBFarmaco';
							$().showFields(dep);
						}
						if (idDiv == 'divcasoBaixaProbabilidade')
						{
							var dep = new Array();
							dep[0] = '#divcasoBaixaProbabilidade';
							$().showFields(dep);
						}
						$('#'+tagname).val($(el).text());
					}
				});
			}
		});
	});
});
