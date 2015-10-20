$(document).ready(function() {
	$('.view-manager').viewManager();
});

/*########################################################*/
/*-------------- ViewManager --------------------*/

(function($)
{	
	// constructor
	function ViewManager(root, conf)
	{	
		// Private vars ------------------------------------------------------------------
		var $root = $(root),
			_root = $root[0],
			_self = this,
			
			$viewSelect,
			$viewHolder,
			$viewFrame,
			
			_lastView,
			$lastSelected,
			
			$pageSelect,
			$pageInput,
			
			$opts = {
				
			};
		$.extend($opts, conf);

		// Public methods ------------------------------------------------------------------		
		// $.extend(_self, {
		// });

		// Private methods -----------------------------------------------------------------
		function init() {
			// $viewSelect = $('.view-select').change($.proxy(onViewSelectChange, this));
			$viewHolder = $('.view-wrapper');
			$viewFrame = $('.view-frame')
				.load($.proxy(onFrameLoaded, this));;
			
			$sizeButtons = $root.find('.icon-btn[data-view]').click($.proxy(onSizeBtnClick, this));
			
			$pageSelect = $('.page-select').change($.proxy(onPageSelectChange, this));
			$pageInput = $('.page-input')
				.change($.proxy(onPageInputUpdate, this))
				.keyup($.proxy(onPageInputKeyUp, this));
			
			$root.find('.reload').click($.proxy(onReloadButtonClick, this));
			$root.find('.new-window').click($.proxy(onNewTabButtonClick, this));
			
			
			//show default content from hash value if set
			if ($.bbq.getState('view', true)) {
				var hashVal = $.bbq.getState('view', true);
				var $target = $sizeButtons.filter('[data-view="' + hashVal + '"]');
				onSizeBtnClick({currentTarget: $target}); //fake event
			}
			if ($.bbq.getState('page', true)) {
				setPage($.bbq.getState('page', true));
			}
		};
		
		function onSizeBtnClick(evt) {
			$clicked = $(evt.currentTarget);
			var _view = $clicked.attr('data-view');
			
			var state = {};
			state['view'] = _view;
			$.bbq.pushState(state);
			
			if (_view == 'max') {
				if ($clicked.hasClass('selected')) {
					$clicked.removeClass('selected');
					resetView();
				} else {
					$lastSelected = $sizeButtons.filter('.selected').removeClass('selected');
					$clicked.addClass('selected');
					setView(_view);
				}
			} else {
				$sizeButtons.removeClass('selected');
				$clicked.addClass('selected')
				setView(_view);
			}
		};
		
		function resetView() {
			$lastSelected.addClass('selected');
			$viewHolder.removeClass().addClass(_lastView);
		};
		
		function setView(id) {
			_lastView = $viewHolder[0].className;
			$viewHolder.removeClass().addClass('view-wrapper v-'+id);
		};
		
		function onPageSelectChange(evt) {
			var state = {};
			state['page'] = $pageSelect.val();
			$.bbq.pushState(state);
			
			setPage(state['page']);
		};
		
		function onPageInputUpdate(evt) {
			var state = {};
			state['page'] = $pageInput.val();
			$.bbq.pushState(state);
			
			setPage(state['page']);
		};
		
		
		function onPageInputKeyUp(evt) {
			var k = (evt.keyCode != 0) ? evt.keyCode : evt.charCode;
			// rTrace('onTextKeyUp; key: ' + k);
			if (k == 13) { //enter
				onPageInputUpdate(evt);
			}
		};
		
		function setPage(url) {
			// $pageSelect.val(url);
			$pageInput.val(url);
			$viewFrame.attr('src', url).addClass('loading');
		};
		
		function onFrameLoaded(evt) {
			$viewFrame.removeClass('loading');
		};
		
		function onReloadButtonClick(evt) {
			// onPageSelectChange(evt);
			onPageInputUpdate(evt);
			return false;
		};

		function openWindow(_src, _target) {
			var _target = _target || '_blank';
			window.open(_src, _target);
		};

		function onNewTabButtonClick(evt) {
			openWindow($pageInput.val());
			return false;
		};
		
		function logMsg(str) {
			try {
				console.log('ViewManager; ' + str);
			} catch (e) {
				//do nothing if the browser doesn't support console.log()
			}
		};
		
		// Initialization ------------------------------------------------------------------
		init();
	};

	// jQuery plugin implementation
	$.fn.viewManager = function(conf) { 
		var opts = {}; //defaults
		$.extend(opts, conf);
		
		this.each(function() {
			var $instance = new ViewManager(this, opts);
			$(this).data("viewManager", $instance);
		});
		
		return this;
	};
})(jQuery);