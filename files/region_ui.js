/*	============================================
	Name:	region_ui.js
	Date:	2013-10-10
	Desc:	Main user interface JavaScript file 
	        for Bentley Regional Sites
	Auth:	Autotorq Ltd. (www.autotorq.com)
	============================================ */

jQuery(document).ready(function ($) {
       
    // enable jQuery noConflict mode
    jQuery.noConflict();
    
    $('body').addClass('jsEnabled');                 
        
    // bookmark event
    $('a.bookmark').click(function(){
        var bookmarkURL = this.href;
        var bookmarkTitle = this.title;
        
        try {
            if (window.sidebar && window.sidebar.addPanel) { // moz
                window.sidebar.addPanel(bookmarkTitle, bookmarkURL, "");
            } else if(window.sidebar && jQuery.browser.mozilla){ // newer moz - sidebar.addPanel deprecated in FF23
                $('a.bookmark').attr('rel', 'sidebar');
            }else if (window.external || document.all) { // ie
                window.external.AddFavorite(bookmarkURL, bookmarkTitle);
            } else if (window.opera) { // duh
                $('a.bookmark').attr('href',bookmarkURL);
                $('a.bookmark').attr('title',bookmarkTitle);
                $('a.bookmark').attr('rel','sidebar');
            }
        } 
        catch (err) { // catch all incl webkit
        alert('Sorry. Your browser does not support this bookmark action. Please bookmark this page manually.');
        }
    });       


    // Main Navigation - hover
    var $mainNav = $('.mainMenu'),
    navWidth = $mainNav.width();
    
    $mainNav.children('.cursorDefault').hover(function(ev) {
        var $this = $(this),
        $dd = $this.find('.main-nav-dd');
        
        // remove the active class (regardless of queue position)
        $('.mainMenu li.cursorDefault').removeClass('main-nav-item-active');
        
        // get the left position of this tab
        var leftPos = $this.find('.main-nav-tab').position().left;
        
        // get the width of the dropdown
        var ddWidth = $dd.width(),
        leftMax = navWidth - ddWidth;
        
        // show the dropdown
        $(this).dequeue();
        $this.addClass('main-nav-item-active');
    }, function(ev) {
    
        // hide the dropdown
        $(this).delay(750)
                .queue(function() {
                    $(this).removeClass('main-nav-item-active');
                    $(this).dequeue();
                });
                
    });    

	
	// Custom Form Dropdown
    $('.formWrap select, .formWrapper select').customSelect();
    
    // 5th level navigation item in Crumbtrail
    if ( $('.actions .breadcrumbs li').length > 4) {
        $('.actions .breadcrumbs li:nth-child(5)').addClass('wrapItem');
    }
    
    // 5th level navigation item in Crumbtrail
    if ( $('.actions .breadcrumbs li').length > 4) {
        $('.actions .breadcrumbs li:nth-child(5)').addClass('wrapItem');
    }
    
    
    // Filmstrip
    function initFilmstrip(s) {	    
	    if ( $(s.galleryContainer).length > 0 ) {   //don't execute if no matching container present on page
		    for (var key in s.filmstripArray) {
			    if ($(s.filmstripArray[key])) {	
    			
			        function jCarousel_initCallback_noScroll(carousel) {
			            $(s.filmstripArray[key]).parents(s.galleryContainer).find(s.btnNext).bind('click', function() {
						    carousel.next();						
						    return false;
					    });
					    $(s.filmstripArray[key]).parents(s.galleryContainer).find(s.btnPrev).bind('click', function() {
						    carousel.prev();
						    return false;
					    });				        
			        }		
    			        
				    function jCarousel_initCallback(carousel) {                        
                        
                        carousel.stopAuto();                        
                        $('.overlayDiv #playCarouselLink').removeClass("playing")
                                                           .addClass("paused")
                                                           .attr("title", "View Slideshow");
                        popupPlaying = false;
                        
					    $(s.filmstripArray[key]).parents(s.galleryContainer).find(s.btnNext).bind('click', function() {
						    carousel.next();						
						    return false;
					    });
					    $(s.filmstripArray[key]).parents(s.galleryContainer).find(s.btnPrev).bind('click', function() {
						    carousel.prev();
						    return false;
					    });					
				    };

				    var wrapSetting = 'circular';	// default setting			

			        $(s.filmstripArray[key]).jcarousel({
				        scroll : 1,					    
				        auto: 0,
				        wrap: wrapSetting,
				        initCallback: jCarousel_initCallback_noScroll,
				        buttonNextHTML: null,
				        buttonPrevHTML: null				
			        });
			    };
		    };
    		
		    $(".jcarousel-prev, .jcarousel-next").disableTextSelect();
		    
		    var $items = $('ul#filmstripHome li img');
		    
		    // hide prev and next buttons if less than 5 items
		    if ($items.length < 5)
		    {
		        $(".jcarousel-prev, .jcarousel-next").hide();
		    }
    		
	    }
	}
	
	var filmstripOptions = {
        filmstripArray: new Array(
            '#filmstripHome',
            '#filmstripFilm',
            '#filmstripInterior',
            '#filmstripExterior',
            '#filmstripGallery',
            '#filmstriphome',
            '#filmstripfilm',
            '#filmstripinterior',
            '#filmstripexterior',
            '#filmstripgallery',
            '#filmstripPopup',
            '#filmstripVisualiser',
            '#filmstripFilmPopup'
        ),
        galleryContainer: '.galleryContainer',
        btnNext: '.jcarousel-next',
        btnPrev: '.jcarousel-prev'
    };
    initFilmstrip(filmstripOptions);
	
	if (('#filmstripHome').length) {
        var overlay = $('ul#filmstripHome li a .overlay ');
        
        overlay.each(function() {
            var $this = $(this);
            var overlayColour = $this.css('color');
            if ( overlayColour == 'rgb(0, 0, 0)' || overlayColour == '#000000' ) {
                //$this.css('background','transparent url("/Bentley/Themes/Region/images/modelTitleBg.png") repeat');
                $this.addClass('light');
            }
            else if ( overlayColour == 'rgb(255, 255, 255)' || overlayColour == '#ffffff' ) {
                //$this.css('background','transparent url("/Bentley/Themes/Region/images/modelTitleBg.png") repeat');
                $this.addClass('dark');
                
            }
        });
        
        $('ul#filmstripHome li a').click(function (e) {
            if (doGoogle == 'true') {
                e.preventDefault();
                linkUrl = "";
                linkUrl += $(this).attr('href');
                window.setTimeout(function () { window.location = linkUrl }, 1);
            }
        });
    }	
    // End Filmstrip code
	
	
	/* MODEL DETAILS GALLERY */
	if ( $('.galleria, #galleria').length ) {
	
	    Galleria.unloadTheme();
	    Galleria.loadTheme('/JS/galleria.classic.min.js');
	    
	    var options = {
            showCounter: false,
            showImagenav: false,
            showInfo: false,
            initialTransition: 'fade',
            wait:false,
            youtube: {
                hd: 1
            }
        }
        
        var prepareGallery = function() {
            
            // identify the image gallery (will be the second in the array if there are 2)
            var index = (Galleria.get().length == 2) ? 1 : 0
                       
            // Add Open/Close button (if there is more than one image)
            if ( $('.galleria .galleria-thumbnails-container a.btn-open, .galleria .galleria-thumbnails-container a.btn-close').length <= 0 ) 
            {                       
                if ( Galleria.get(index).getDataLength() > 1 ) {
                    addToggleButton();
                }
                else
                {
                    $('.galleria .galleria-thumbnails-container').hide();
                }               
            }        
        };           
        
        // Tabs
        var galleryTabs = $('.galleryTabs .menu-row a');
        galleryTabs.click(function() {
            if (!$(this).hasClass('active')) {
                var booFilm = ( $(this).hasClass('film') ) ? true : false;
                changeGallery(this, booFilm, options);
            }
        });                    
	          
	    //if ( $('#galleryContainer').length )
	    //{
	    //    // run the image gallery on first load
	    //    Galleria.run('#galleryContainer', options);         
	    //}
	    //else if ( $('#filmContainer').length )
	    //{
	    //    // run the video gallery on first load
	    //    Galleria.run('#filmContainer', options);   	    
	    //}          
        var playFilm = false;
        galleryTabs.each(function () {
            if ($(this).hasClass('active')) {
                playFilm = ($(this).hasClass('film')) ? true : false;
            }
        });
       
        if (playFilm) {
            Galleria.run('#filmContainer', options);
            $('#galleryContainer').hide();
        }
        else
        {
            Galleria.run('#galleryContainer', options);
        }
        Galleria.ready(prepareGallery);
        
                
        function changeGallery(obj, booFilm, options) {
            var $this = $(obj);
            var galleryTabs = $('.galleryTabs .menu-row a');
            var activeTab = $this.attr('class');
            var activeGallery = '.vehicleGalleryWrapper #' + activeTab + 'Container';          
                        
            for (var i = 0; i < Galleria.get().length; i++)
            {
                var gallery = Galleria.get(i);
                gallery.destroy();        
            }

            Galleria.unloadTheme();
            Galleria.loadTheme('/JS/galleria.classic.min.js');    
                
            //Galleria.run('.galleria', options);                
            if (booFilm) {
                Galleria.run('#filmContainer', options);
            } else {
                Galleria.run('.galleria', options);
            }
            Galleria.ready(prepareGallery);                
                
            galleryTabs.removeClass('active');
            $this.addClass('active');
            $('.vehicleGalleryWrapper .galleria').hide();
            $(activeGallery).fadeIn('slow');         
        }        
    }
});


function addToggleButton() {
    var toggleButtonHTML = '<a href="#" class="btn-open"><span class="hoverImg"></span><img src="/Bentley/Themes/Region/images/gallery_toggle_open.png" alt="Open" /></a>';
    toggleButtonHTML += '<a href="#" class="btn-close"><span class="hoverImg"></span><img src="/Bentley/Themes/Region/images/gallery_toggle_closed.png" alt="Close" /></a>';
    var $openButton = $('.galleria .galleria-thumbnails-container .btn-open');
    var $closeButton = $('.galleria .galleria-thumbnails-container .btn-close');
    var $thumbsContainer = $('.galleria .galleria-thumbnails-container');

    $thumbsContainer.append(toggleButtonHTML);
    
    // Open thumbnails container
    $('.galleria .galleria-thumbnails-container .btn-open, .galleryTabs a.gallery').click(function(event) {
        event.preventDefault();
        $thumbsContainer.stop().animate({bottom:0},750);
        $('.galleria .galleria-thumbnails-container .btn-open').hide();
        $('.galleria .galleria-thumbnails-container .btn-close').show();
    });
    
    // Close thumbnails container
    $('.galleria .galleria-thumbnails-container .btn-close').click(function(event) {
        event.preventDefault();
        $thumbsContainer.stop().animate({bottom:-125},750);
        $('.galleria .galleria-thumbnails-container .btn-close').hide();
        $('.galleria .galleria-thumbnails-container .btn-open').show();
    });
    
    // Default state of thumbnails container
    $('.galleria .galleria-thumbnails-container .btn-close').click();
}





