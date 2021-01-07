$(document).ready(function(){
	$("#cep").blur(function(){
		var cep = $("#cep").val();
		$.getJSON("https://api.postmon.com.br/v1/cep/" + cep).
				done(onAjaxSuccess).
				fail(onAjaxError);
	});
});

	function onAjaxSuccess(data) {	
		$("#bairro").val(data.bairro);
		$("#cidade").val(data.cidade);
		$("#logradouro").val(data.logradouro);
		$("#uf").val(data.estado);
	}
	
	function onAjaxError(data) {
		$("#bairro").val("");
		$("#cidade").val("");
		$("#logradouro").val("");
		$("#uf").val("");
		toastrNotifica("error", "Não foi possível localizar seu CEP, verifique se está correto ou insira as informações manualmente.", "CEP não encontrado");		

	}


// Disable form submissions if there are invalid fields
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Get the forms we want to add validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();


function validaForm() {
	var valida = true;
	var arr_dados = [];
	$('#cad [required]').each(
		function(index){  
			var input = $(this);
			//console.log(' id : ' + input.attr('id')  + ' Value: ' + input.val());
			if(input.val() == ""){
				valida = false;
			}
		}
	);
	//return valida;
	if(valida == true){
		event.preventDefault();
		simulaSubmit();
	}else{
		
		toastrNotifica("error", "Os campos em vermelho são de preenchimento obrigatório.", "Campos obrigatórios");
		return valida;
	}
}

function toastrNotifica(tipo, descricao, titulo){
	
	toastr[tipo](descricao, titulo)
	
	toastr.options = {
		  "closeButton": true,
		  "debug": false,
		  "newestOnTop": false,
		  "progressBar": true,
		  "positionClass": "toast-top-right",
		  "preventDuplicates": false,
		  "onclick": null,
		  "showDuration": "300",
		  "hideDuration": "1000",
		  "timeOut": "5000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		}
	
}

function simulaSubmit(){
    toastrNotifica("success", "Seu formulário foi enviado com sucesso!", "Formulário Enviado");
	console.log('Dados Corretos');
	var dados = $('#cad').serializeArray();
    jQuery.each( dados, function( i, field ) {
      console.log(" " + field.name + " "+ field.value );
    });
}


function mascara(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
}
function execmascara(){
    v_obj.value=v_fun(v_obj.value)
}

function soNumeros(v){
    return v.replace(/\D/g,"")
}
function soLetras(v){
    return v.replace(/[^a-zA-Z]+/g, "").toUpperCase();
}

function valida_telefone(v){
    v=v.replace(/\D/g,"")                 //Remove tudo o que não é dígito
    v=v.replace(/^(\d\d)(\d)/g,"($1) $2") //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d{4})(\d)/,"$1-$2")    //Coloca hífen entre o quarto e o quinto dígitos
    return v
}

function valida_cep(v){
    v=v.replace(/D/g,"")                //Remove tudo o que não é dígito
    v=v.replace(/^(\d{5})(\d)/,"$1-$2") //Esse é tão fácil que não merece explicações
    return v
}

function valida_cpf(v){
    v=v.replace(/\D/g,"")                    //Remove tudo o que não é dígito
    v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
                                             //de novo (para o segundo bloco de números)
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
    return v
}
function mdata(v){
    v=v.replace(/\D/g,"");
    v=v.replace(/(\d{2})(\d)/,"$1/$2");
    v=v.replace(/(\d{2})(\d)/,"$1/$2");

    v=v.replace(/(\d{2})(\d{2})$/,"$1$2");
    return v;
}