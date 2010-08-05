/**
 * Actions.js
 *
 * Author: Fernando.Ferreira@icsystems.com.br
 * Date:   March 15th, 2010
 *
 **/

//global functions

function getScrollXY() {
	var myWidth = 0, myHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}
		return [ myWidth, myHeight ];
}

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

	//Controle de caracteres estranhos

	$('#escoreRedeNeural').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)||(e.which == 13))
			return false;
	});

	$('#probabilidadeTBClinicoRadiologica').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)||(e.which == 13))
			return false;
	});

	var hlcolor = '#FFF8C6';
	var d = new Date();
	var cYear = d.getFullYear();


        //Checking aids exam date
        years = new Array();
        for (i=cYear-100; i <=cYear; i++)
                years.push(i.toString());


	$('#data_rx').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		maxDate: '+0d',
		changeMonth: true,
		changeYear: true,
		maxDate : '+0y',
		minDate : '-130y',
		yearRange : '-130:+130',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});

	$('#padrao').change(function(){

		var baixa = new Array();
		baixa[0] = '#divcasoBaixaProbabilidade';

		//Definindo a probabilidade
		if ($(this).val() == 'padraoTipico')
			$('#probabilidadeTBAtivaAposEstudoRX').val('Alta');
		else if ($(this).val() == 'padraoCompativel')
                        $('#probabilidadeTBAtivaAposEstudoRX').val('Média');
		else if ($(this).val() == 'padraoAtipico')
		{	
			$('#probabilidadeTBAtivaAposEstudoRX').val('Baixa');
                        for(div in baixa){
                                if($(baixa[div]).css('display') != 'block')
                                        $(baixa[div]).toggle(function() {
                                                $(this).css('background-color', hlcolor);
                                                $(this).animate({backgroundColor : "white"}, 4000);
                                        });
                        }
		}
		
		if($(this).val() != 'padraoAtipico')
			for(div in baixa)
				if($(baixa[div]).css('display') != 'none')
					$(baixa[div]).toggle();
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

	$('div.secondary').css('display', 'none');


	$('#form_consulta').validate({
		rules: {
			localTuberculose: {
				required: true
			},
			desfechoTratamento: {
				required: true
			},
			escoreRedeNeural:{
				required: true
			},
			probabilidadeTBAtivaAposEstudo:{
				required: true,
				number: true,
				max: 100
			},
			data_rx:{
				date: true,
				required: true
			},
			probabilidadeTBClinicoRadiologica: {
				required: true,
				number: true,
				max: 100
			},
            data_ultimo_tratamento:{
				min: 1910,
                minlength: 4,
                maxlength: 4
            },
			diagnostico: {
				required: true
			}
		}
	});

        //Load previous exams
        var sUrl="./cgi-bin/retrieveExames.py";
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
