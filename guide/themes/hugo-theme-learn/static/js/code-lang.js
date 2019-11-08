// $(document).ready(function() {
// 	function n() {
// 		var e = 1
// 		window.localStorage.getItem('configLangPref') &&
// 			(e = window.localStorage.getItem('configLangPref')),
// 			$('.nav-tabs a')
// 				.closest('.code-tabs')
// 				.find('.active')
// 				.removeClass('active'),
// 			$('.code-tabs ul.nav-tabs')
// 				.find('li:nth-of-type(' + e + ')')
// 				.addClass('active'),
// 			$('.code-tabs .tab-content')
// 				.find('div:nth-of-type(' + e + ')')
// 				.addClass('active')
// 	}
// 	$('.tab-content')
// 		.find('.tab-pane')
// 		.each(function(e, t) {
// 			var a = $(this)
// 					.closest('.code-tabs')
// 					.find('.nav-tabs'),
// 				s = $(this).attr('title')
// 			a.append('<li><a href="#">' + s + '</a></li')
// 		}),
// 		n(),
// 		$('.nav-tabs a').click(function(e) {
// 			e.preventDefault()
// 			var t = $(this).parent(),
// 				a = t.index(),
// 				s = $(this).closest('.code-tabs'),
// 				o = s.find('.tab-pane').eq(a)
// 			s.find('.active').removeClass('active'),
// 				t.addClass('active'),
// 				o.addClass('active'),
// 				window.localStorage &&
// 					window.localStorage.setItem('configLangPref', a + 1),
// 				n()
// 		})
// })
