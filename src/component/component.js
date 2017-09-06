const Component = function() {
	let tpl = ()=>{
		let res = ""
		for(let x in this.plugin) {
			let typeList = this.plugin[x]
			let htmlstr = ""
			let titleName = ""
			for(let y in typeList) {
				titleName = typeList[y].typeName
				htmlstr += `<div name=${y} class='componentItem'>
									<a>${typeList[y].text}</a>
								</div>`
			}
			
			res += `<div class="panel-heading">
				<h4 class="panel-title">
					<a data-toggle="collapse" href="#cpn_${x}">
						${titleName}
					</a>
				</h4>
			</div>
			<div id="cpn_${x}" class="panel-collapse collapse in">
				<div class="panel-body">${htmlstr}</div>
			</div>`
		}
		return res
	}
	let str = `<div class="tab-content">
		<div class="tab-pane in active" id="base">
			<div class="panel-group">
				<div class="panel panel-default">
					${tpl()}
				</div>
			</div>
		</div>
		<div class="tab-pane" id="combine">
			<div class="panel-group">
				<div class="panel panel-default">
					
				</div>
			</div>
		</div>
		<div class="tab-pane" id="template">
			模板
		</div>
	</div>`
	this.$body.find(".component .content").append(str)
	this.$body.find(".component .content").delegate(".componentItem", "mousedown", {
		inthis: this
	}, function(e) {
		if(e.button != 0) {
			return false
		}
		let This = e.data.inthis
		let pos = This.until.mousePosition(e)
		let type = $(this).attr("name")
		let template = This.pluginAll[type].template
		This.initContainer()

		This.$shadow.append(template)
		This.$shadow.css({
			left: pos.x,
			top: pos.y
		})
		This.$shadow.show()
		This.$leftRulerDash.show()
		This.$topRulerDash.show()
		window.onmousemove = _.throttle(function(e) {
			let _pos = This.until.mouseRoundPosition(e, This.until.getElCoordinate(This.$view[0]))
			This.$leftRulerDash.css({
				left: _pos.x - This.$offsetWidth
			})
			This.$topRulerDash.css({
				top: _pos.y - This.$offsetHeight
			})
			This.$shadow.css({
				left: _pos.x,
				top: _pos.y
			})
			This.focusNodes(This.inContainer(_pos.x - This.$offsetWidth - 45, _pos.y - This.$offsetHeight - 45))
		}, 50)
		window.onmouseup = function(e) {
			if(This.$focus) {
				let dom_pos = This.until.getElCoordinate(This.$workInner[0])
				let mouse_pos = This.until.mouseRoundPosition(e, This.until.getElCoordinate(This.$view[0]))
				let X = mouse_pos.x - dom_pos.left - This.getRealPosition(This.$focus).left
				let Y = mouse_pos.y - dom_pos.top - This.getRealPosition(This.$focus).top
				This.addNodes({
					id: "node_" + new Date().getTime(),
					name: type,
					left: X,
					top: Y,
					containerid: This.$focus
				})
			} else {
				let dom_pos = This.until.getElCoordinate(This.$workInner[0])
				let mouse_pos = This.until.mouseRoundPosition(e, This.until.getElCoordinate(This.$view[0]))
				let X = mouse_pos.x - dom_pos.left
				let Y = mouse_pos.y - dom_pos.top
				This.addNodes({
					id: "node_" + new Date().getTime(),
					name: type,
					left: X,
					top: Y
				})
			}
			This.$shadow.empty()
			This.$shadow.hide()
			This.$leftRulerDash.hide()
			This.$topRulerDash.hide()
			window.onmousemove = null
			window.onmouseup = null
		}
	})
}
export default Component