//de56adfb4464fe42dade323a5e27b5aea9c6ceb0
	
	const url_base = "https://api.github.com";
	const auth = 'de56adfb4464fe42dade323a5e27b5aea9c6ceb0';
	
	axios({
		method: 'get',
		url: url_base + '/repositories',
		auth: auth
	})
	.then(function (response) {
		console.log(response)
		listaRepos(response.data);
	});

	$(document).ready(function(){

		$( "#repos" ).change(function() {
			$("#contributors tbody").empty();
			$("#issues tbody").empty();
			listaContributors($( "select option:selected" ).val());
			listaIssues($( "select option:selected" ).val());
		});

		$('#radio1').click(function() {
			$("tr").filter(".open").show();
			$("tr").filter(".close").hide();
		});
		
		$('#radio2').click(function() {
			$("tr").filter(".close").show();
			$("tr").filter(".open").hide();
		});

		$( "#issues tbody" ).on( "click", "tr", function() {
			var issue = $(this).attr('url');
			console.log( issue );
			var n1 = issue.search("/repos");
			issue = issue.substring(n1);

			var comments = $(this).attr('comments_url'); 
			var n2 = comments.search("/repos");
			comments = comments.substring(n2);
			console.log( issue );
			console.log( comments );
			getDadosIssueModal(issue, comments);
		});
	});



function listaRepos(data){
	console.log(data);
	_.forEach(data, function(item) {
		  $('#repos').append($('<option>', { 
			value: item.full_name,
			text : item.full_name 
		}));
	});
}

function listaContributors(fullName){
	if(fullName == -1){
	  	$('#contrib1').hide();
		$('#contrib2').hide();
		$('#contrib3').hide();
		$('#issue').hide();
		return;
	}
	const limit = 20;
	axios({
		method: 'get',
		url: url_base + '/repos/'+fullName+'/contributors',
		auth: auth
	})
	.then(function (response) {
		console.log('contributors');
		console.log(response)
		console.log(response.data);
		$('#contributors1 tbody').empty();
		$('#contributors2 tbody').empty();
		$('#contributors3 tbody').empty();
		
		var filtro10 = _.filter(response.data, function(item) { return item.contributions > 10 && item.contributions < 21; });		
		_.forEach(filtro10, function(item, i) {
			if(i >= limit) { return; }
			$('#contributors1 tbody').append('<tr><td>'+item.login
				+'</td><td><a href="'+item.html_url+'" target="_blank">'
				+item.html_url+'</a></td><td>'+item.contributions+'</td></tr>');
		});
		
		var filtro20 = _.filter(response.data, function(item) { return item.contributions > 20 && item.contributions < 51; });
		_.forEach(filtro20, function(item, i) {
			if(i >= limit) { return; }
			$('#contributors2 tbody').append('<tr><td>'+item.login
				+'</td><td><a href="'+item.html_url+'" target="_blank">'
				+item.html_url+'</a></td><td>'+item.contributions+'</td></tr>');
		});
		
		
		var filtro50 = _.filter(response.data, function(item) { return item.contributions > 50; });
		_.forEach(filtro50, function(item, i) {
			if(i >= limit) { return; }
			$('#contributors3 tbody').append('<tr><td>'+item.login
				+'</td><td><a href="'+item.html_url+'" target="_blank">'+
				item.html_url+'</a></td><td>'+item.contributions+'</td></tr>');
		});

		if(filtro10.length == 0){			
			$('#contributors1 tbody').append('<tr><td colspan="3">Sem informações</td></tr>');
		}
		if(filtro20.length == 0){		
			$('#contributors2 tbody').append('<tr><td colspan="3">Sem informações</td></tr>');
		}
		if(filtro50.length == 0){		
			$('#contributors3 tbody').append('<tr><td colspan="3">Sem informações</td></tr>');
		}
	});
	
  	$('#contrib1').show();
	$('#contrib2').show();
	$('#contrib3').show();
	$('#issue').show();
}

function listaIssues(fullName){
  	if(fullName == -1){
	  	$('#contrib1').hide();
		$('#contrib2').hide();
		$('#contrib3').hide();
		$('#issue').hide();
		return;
	}
	
	axios({
		method: 'get',
		url: url_base + '/repos/'+fullName+'/issues',
		auth: auth
	})
	.then(function (response) {
		console.log('issues');
		console.log(response)
		console.log(response.data);
		$('#issues tbody').empty();
		_.forEach(response.data, function(item) {
			$('#issues tbody').append('<tr class="'+item.state+'" url="'+item.url
				+'" comments_url="'+item.comments_url+'" ><td>'+item.title
				+'</td><td style="text-transform: capitalize;">'+item.state+'</td>'
				+'<td><h4 class="dadosModal" data-toggle="modal" data-target="#myModal">+</h4></td></tr>');
		});
	});
}


function getDadosIssueModal(issue, comments){
	$('.modal-title').html("");
	$('.corpo').html("");
	
	axios({
		method: 'get',
		url: url_base + issue,
		auth: auth
	})
	.then(function (response) {
		console.log(response)
		var descri = response.data.body == "" ? "Sem descrição" : response.data.body;
		console.log('issues');
		console.log(response.data);
		$('.modal-title').html(response.data.title);
		$('.corpo').append('<div class="container rounded bg-light border  p-5"><h6>'
		+ response.data.user.login + ' <small>publicou em ' + new Date(response.data.created_at).toLocaleString() 
		+'</small></h6><p>'+ descri + '</p></div><br>');
	});

	$('.comentarios').html("");
	axios({
		method: 'get',
		url: url_base + comments,
		auth: auth
	})
	.then(function (response) {
		console.log('issues');
		console.log(response)
		console.log(response.data);
		_.forEach(response.data, function(item) {
			$('.comentarios').append('<hr><div class="container"><p>'
				+ item.body + '</p><h6>'+ item.user.login + ' <small>comentou em '
				+ new Date(item.created_at).toLocaleString() +'</small></h6></div><br>');
		});
	});	
}