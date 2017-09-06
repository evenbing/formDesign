const View = function() {
	this.$workInner = $(`<div class='workInner'><div class='workInnerResize'><span class="resizeIcon"></span></div></div>`)
	this.$workInner.css({
		height: this._property.height,
		width: this._property.width
	})
	this.$view = $(`<div class='work'></div>`)
	this.$body.find(".view .workArea").append(this.$workInner)
	this.$workInner.append(this.$view)
	
	this.$workInner.delegate(".workInnerResize", "mousedown", {
		inthis: this
	}, function(e) {
		let This = e.data.inthis
		let dom = This.$workInner
		let dom_pos = This.until.getElCoordinate(dom[0])
		let X,Y
		window.onmousemove = _.throttle(function(e) {
			let mouse_pos = This.until.mousePosition(e)
			X = mouse_pos.x - dom_pos.left < 0?0:mouse_pos.x - dom_pos.left
			Y = mouse_pos.y - dom_pos.top < 0?0:mouse_pos.y - dom_pos.top
			dom.css({
				width:X,
				height: Y
			})
			This.changeTitleSize(X,Y)
		}, 50)
		window.onmouseup = function(e) {
			window.onmousemove = null
			window.onmouseup = null
		}
	})
	
	this.$container.on("click", {
		inthis: this
	}, function(e) {
		let This = e.data.inthis
		if(e.button != 0) {
			return false
		} else if(e.target.className == "nodes") {
			This.focusNodes(e.target.id)
		} else if($(e.target).parents(".nodes").length > 0) {
			This.focusNodes($(e.target).parents(".nodes").attr("id"))
		} else {
			This.blurNodes()
		}
	})
	this.$view.delegate(".nodes", "mousedown", {
		inthis: this
	}, function(e) {
		let This = e.data.inthis
		if(e.button != 0) {
			return false
		}
		if(This.$focus != $(this).attr("id")) {
			return false
		}
		if($(e.target).className == "resize" || $(e.target).parent(".resize").length>0){
			return false
		}
		let dom = $(this)
		let id = dom.attr("id")
		let X, Y
		This.$leftRulerDash.show()
		This.$topRulerDash.show()
		let mouse_pos_temp = This.until.mousePosition(e)
		let dom_pos_temp = This.until.getElCoordinate($(this)[0])
		let offsetX = mouse_pos_temp.x - dom_pos_temp.left
		let offsetY = mouse_pos_temp.y - dom_pos_temp.top

		window.onmousemove = _.throttle(function(e) {
			let mouse_pos = This.until.mouseRoundPosition(e, This.until.getElCoordinate(This.$view[0]), {
				x: offsetX,
				y: offsetY
			})
			let dom_pos = This.until.getElCoordinate(This.$view[0])
			let temp_pos = This.getRelativePosition(This.$focus)
			X = mouse_pos.x - dom_pos.left - temp_pos.left
			Y = mouse_pos.y - dom_pos.top - temp_pos.top
			X = X >= 0 ? X : 0
			Y = Y >= 0 ? Y : 0
			let left = X + dom_pos.left + temp_pos.left - This.$offsetWidth
			let top = Y + dom_pos.top + temp_pos.top - This.$offsetHeight
			This.$leftRulerDash.css({
				left: left
			})
			This.$topRulerDash.css({
				top: top
			})
			dom.css({
				left: X,
				top: Y
			})
		}, 50)
		window.onmouseup = function(e) {
			This.$leftRulerDash.hide()
			This.$topRulerDash.hide()
			window.onmousemove = null
			window.onmouseup = null
		}
	})
	this.$view.delegate(".resize", "mousedown", {
		inthis: this
	}, function(e) {
		let This = e.data.inthis
		let mode
		let dom = $(this).parent(".nodes").children(".mes__formDesign_resize")
		if(dom.hasClass("horizontal")){
			mode = "horizontal"
		}
		else if(dom.hasClass("vertical")){
			mode = "vertical"
		}
		else{
			mode = "both"
		}
		let dom_pos = This.until.getElCoordinate(dom[0])
		let X,Y
		window.onmousemove = _.throttle(function(e) {
			let mouse_pos = This.until.mousePosition(e)
			X = mouse_pos.x - dom_pos.left < 0?0:mouse_pos.x - dom_pos.left
			Y = mouse_pos.y - dom_pos.top < 0?0:mouse_pos.y - dom_pos.top
			let stl = {}
			if(mode == "horizontal"){
				stl = {
					width:X
				}
			}
			else if(mode == "vertical"){
				stl = {
					height: Y
				}
			}
			else if(mode == "both"){
				stl = {
					width:X,
					height: Y
				}
			}
			dom.css(stl)
		}, 50)
		window.onmouseup = function(e) {
			window.onmousemove = null
			window.onmouseup = null
		}
	})
	
	
	
	this.$view.delegate(".delete", "click", {
		inthis: this
	}, function(e) {
		if(e.button != 0) {
			return false
		}
		let This = e.data.inthis
		This.deleteNodes(This.$focus)
	})
}
export default View