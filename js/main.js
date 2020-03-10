$(document).ready(function(){

	/** 
	* PLUGINS
	* Todo el JS está dividido en módulos que cargamos opcionalmente junto con
	* sus dependencias (otros JS y CSS).
	*
	* Con la función cargarPlugin() definimos si se carga o no y con cargarRecursos()
	* cargamos dinámicamente todas las dependencias del script que queremos ejecutar.
	*
	* CargarPlugin() lee un array creado con el método Plugins::activar() del helper 
	* Plugins (core/Plugins.php)
	*
	* Ej :  Plugins::activar('owlCarousel')
	*/
	let dropdown = document.querySelector('.dropdown');
	dropdown.addEventListener('click', function(event) {
	    event.stopPropagation();
	    dropdown.classList.toggle('is-active');
	    $('.icom').toggleClass('rotat');
	});
	// Tabs
		// https://github.com/filamentgroup/Accessible-jQuery-Tabs


	$(document).ready(function() {

	  // Check for click events on the navbar burger icon
	  $(".navbar-burger").click(function() {

	      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
	      $(".navbar-burger").toggleClass("is-active");
	      $(".navbar-menu").toggleClass("is-active");

	  });
	});



	// WOW (animación)
	// https://github.com/matthieua/WOW
	if( cargarPlugin('animacion') ){
		cargarRecursos([
			{tipo: 'css',  src: 'css/animate.min.css'},
			{tipo: 'js',  src: 'js/jquery.wow/wow.min.js'},

		], function(){
			wow = new WOW({
				boxClass:     'wow',     
				animateClass: 'animated',
				offset:       0,         
				mobile:       true,      
				live:         false       
		    }).init();
		});
	}

	

	/** 
	* JS GENERALES
	* Estos scripts se ejecutan siempre.
	*
	*/

	// Transiciones entre páginas y animación de enlaces internos # ///

	$(function() {



		$('html').addClass('active'); /* [1] */

		$('a[href]').each(function() { /* [2] */
			if ( location.hostname === this.hostname || !this.hostname.length ) { /* [2] */

				var link = $(this).attr("href"); /* [3] */

				if ( link.match("^#") ) { /* [4] */

					$(this).click(function() {
						var target = $(link); /* [5] */
						target = target.length ? target : $('[name=' + this.hash.slice(1) +']'); /* [5] */
						if (target.length) {
							$('html,body').animate({ /* [6] */
							scrollTop: target.offset().top - 70 /* [6] */
							}, 1000); return false; /* [6] */
						}
					});

				} else if ( link.match("^mailto") ) { /* [7] */
					// Act as normal  /* [7] */
				} else {

					$(this).click(function(e) {
					e.preventDefault(); /* [8] */
					$('html').removeClass('active'); /* [9] */
					setTimeout(function() { /* [10] */
					window.location = link; /* [10] */
					}, 500); /* [10] */
					});

				}

			}

		});

	});




	 
	/// Scroll en cabecera ///
	// Anima el menú cuando hay scroll
	$( window ).scroll(function(){
		var $cabecera = $('.cabecera');
		if( $(window).scrollTop() > 20){
			$cabecera.addClass('scroll');
		}else{
			$cabecera.removeClass('scroll');
		}
	});
	// Oculta y muestra el menú cuando hay scroll
	var $cabecera = $('.cabecera');
	var previousScroll = 0;
	$(window).scroll(function(event){
	   var scroll = $(this).scrollTop();
	   if (scroll > previousScroll && scroll > 400){
	       $cabecera.addClass('ocultar');
	       //Cierra el menú cuando hay scroll
			$(".navbar-collapse").removeClass("in").addClass("collapse");
			$(".hamburger").removeClass("is-active");
	   } else {
	      $cabecera.removeClass('ocultar');
	   }
	   previousScroll = scroll;
	});

	/// Menú hamburguesa ///
	$(document).ready(function(){
		$('.hamburger').click(function(){
			$(this).toggleClass('is-active');
			$('.nav-movil').toggleClass('activo');
			$('#Group-11-Copy-4').toggleClass('activo');
		});
	});




	/** 
	* HELPERS
	* Estas funciones son las que usamos definir si cargar o no el resto del JavaScript
	* y cargar sus recursos
	*
	*/

	// Reviso si cargar un plugin JS
	// Cargo solo los plugins listados en el array jsPlugins (El array jsPlugins se genera con PHP).
	function cargarPlugin(plugin){
		return (window.jsplugins.indexOf( plugin ) !== -1);
	}

	// Cargo los recursos dinámicamente y ejecuto el callback
	// (Pueden ser CSS o JS)
	function cargarRecursos(recursos, callback) {
		var total = recursos.length;
		recursos.forEach(function(r){
			var s;
			if(r.tipo == 'css'){
				s = document.createElement( 'link' );
				s.setAttribute('rel','stylesheet');
				s.setAttribute('type','text/css');
				s.setAttribute('href',r.src);
			}
			if(r.tipo == 'js'){
				s = document.createElement( 'script' );
				s.setAttribute( 'src', r.src );
			}
			s.onload = s.onreadystatechange = function() {
			    if(!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
			        total--;
					/*console.log('Cargó ' + r.src);*/
    				if(total === 0){
    					callback();
    				}
			    }
			};
			document.head.insertBefore(s, document.head.firstChild);
		});
	}
});


	// Modal Version Beta

// document.addEventListener('DOMContentLoaded', modal);

// function modal () {

//   document.getElementById("cerrarBtn").addEventListener("click", cerrar);
//   document.body.addEventListener("click", cerrar);
//   window.addEventListener("keydown", cerrar);

//   function cerrar () {
//     document.getElementById("popup").style.display = "none";
//     document.getElementById("sombra").style.display = "none";
//     document.body.style.overflowY = "scroll";
//   }
// }
