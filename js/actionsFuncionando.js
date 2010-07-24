/**
 * Actions.js
 *
 * Author: Fernando.Ferreira@icsystems.com.br
 * Date:   March 15th, 2010
 *
 **/


if(typeof(String.prototype.trim) === "undefined")
{
	String.prototype.trim = function()
	{
		return String(this).replace(/^\s+|\s+$/g, '');
	};
}

var not_tested = new Array();
not_tested[0]  = new Array();
not_tested[0]  = ['R', 'H','E', 'S', 'Z', 'Et', 'O', 'L', 'T', 'M'].sort();

var sensivel  = new Array();
var resistent = new Array();

(function($) {
/* jQuery object extension methods */
	$.fn.extend({
		appendText: function(e) {
			if ( typeof e == "string" )
				return this.append( document.createTextNode( e ) );
			return this;
		}
	});
})(jQuery);


//Document is ready, let's play
$(document).ready(function(){
	var hlcolor = '#FFF8C6';
	$('#data_antiHIV').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		maxDate: '+0d',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});
	$('#data_rx').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		maxDate: '+0d',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});
	//Toggle options
	//Teste do HIV
	//-----------------------------------------------------
	//Pegar o codigo de outro form
	//-----------------------------------------------------

	$('select', '#sensivel_td').change(function(){
		var text = $('#sensivel_div').html();
		var v = '';
		if(text.trim() != '') v= ', ';
		$('#sensivel_div').html(text + v + $(this).val());
	});

	//Probabilidade de TBativa
	$('#probabilidadeTBAtivaAposEstudoRX').change(function(){
		var alta = new Array();
		alta[0] = '#divCativacao';
		alta[1] = '#divPadraoTipico';
		alta[2] = '#divCompativel';
		alta[3] = '#divAtipico';
		var baixa = new Array();
		baixa[0] = '#divcasoBaixaProbabilidade';
		// Se alta ou media, disponibilizar colunas listadas a cima
		if($(this).val()=='alta' || $(this).val() == 'media'){
			for(div in alta){
				if($(alta[div]).css('display') != 'block')
					$(alta[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
			for(div in baixa){
				var elems = $('*', baixa[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
				});
				if($(baixa[div]).css('display') != 'none')
					$(baixa[div]).toggle();
			}
		}
		// Se baixa, ocultar colunas listadas a cima
		if($(this).val()=='baixa'){
			for(div in alta){
				var elems = $('*', alta[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
				});
				if($(alta[div]).css('display') != 'none')
					$(alta[div]).toggle();
			}
			for(div in baixa){
				if($(baixa[div]).css('display') != 'block')
					$(baixa[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
		}
	});

        //O diagnostico eh tb???
        $('#diagnostico').change(function(){
                var dep = new Array();
                dep[0] = '#divDiagnosticoDiferenteTB';
                // Se naun, disponibilizar colunas listadas a cima
                if($(this).val()=='nao_tb'){
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
                } else {
                        for(div in dep){
                                var elems = $('*', dep[div]);
                                $(elems).each(function(){
                                        var element = $(this);
                                        if (   element[0].nodeName != 'FIELDSET'
                                            && element[0].nodeName != 'SMALL'
                                            && element[0].nodeName != 'OPTION')
                                                $(this).removeClass('required');
                                });
                                if($(dep[div]).css('display') != 'none')
                                        $(dep[div]).toggle();
                        }
                }
        });
        $('#diagnosticoDifOutros').click(function(){
                if($(this).is(':checked')){
                        $('').attr('checked', 'true');
                        $('input[name=outro_diagnostico_sim]').removeAttr('disabled');
                        return;
                }
                $(this).removeAttr('checked');
                $('input[name=outro_diagnostico_sim]').val('');
                $('input[name=outro_diagnostico_sim]').attr('disabled', 'true');
                return;
        });
;

	$('div.secondary').css('display', 'none');

	//--------------------------------------------
	//Alterar o validate. Nao esquecer. VIT
	//--------------------------------------------

	$('#form_consulta').validate({
		rules: {
			soroColetado: {
				required: true
			},
			sangueColetado: {
				required: true
			},
			resultadoLeitura:{
				required: true,
				number: true
			},
			pt:{
				required: true
			},
			HIVteste:{
				required: true
			},
			probabilidadeTBAtiva: {
				required: true
			},
			data_rx: {
				date: true,
				required: true
			}
		}
	});

        //Load previous exams
        var sUrl="/cgi-bin/neuraltb/retrieveExames.py";
        var edits = new Object();

        var returned = $.ajax({
                url:sUrl,
                dataType:'html',
                complete: function(xhr, textStatus){
                        var response = xhr.responseText;
                        if(textStatus = 'success'){
                                $('#divExames').html(response);
                                var sizeH =  0.9*(getScrollXY()[1] - 176) + 'px';
                                $('#divExames').height(sizeH);
                                //$('#divExames').css('overflow', 'all');
                                $('#divExames').jScrollPane({showArrows:true});
                                menuYloc = 176;
                                $(window).scroll(function () {
                                        var offset = menuYloc+$(document).scrollTop()+"px";
                                        $('div.jScrollPaneContainer').animate({top:offset},{duration:500,queue:false});
                                });
                                $('tr:odd','#divExames table').css(
                                        "background-color", "#E0EEEE"
                                );
                        }else{
                                alert("Nao foi possível carregar exames anteriores");
                        }
                }
        });
        var menuYloc = null;
});
