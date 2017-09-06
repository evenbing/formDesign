const Head = function() {
	this.$head =
		$(`<div class="headTool">
					<div class="back">
						返回上级
					</div>
					<div class="title">
						<div class="left">
							${this._property.title}
							<span class="size">(${this._property.width} X ${this._property.height})</span>
						</div>
						<div class="right">
							<ul>
								<li id="save"><span class="glyphicon glyphicon-floppy-save"></span>保存</li>
								<li id="view"><span class="glyphicon glyphicon-eye-open"></span>预览</li>
								<li id="setting"><span class="glyphicon glyphicon-cog"></span>设置</li>
							</ul>
						</div>
					</div>
				</div>`)
	this.$container.append(this.$head)
	this.$offsetHeight = parseInt(this.$head.css("height"))
	this.$head.delegate(".back", "click", {
		inthis: this
	}, function(e) {
		let This = e.data.inthis
		if(This.$autosave) {
			window.clearInterval(This.$autosave)
		}
		This.callback.onCloseClick()
	})

	this.$head.delegate("li", "click", {
		inthis: this
	}, function(e) {
		let This = e.data.inthis
		if(e.currentTarget.id == "save") {
			This.until.fn(This.callback.onSaveClick, [This.exportData()])
		} else if(e.currentTarget.id == "view") {
			This.viewHtml()
			This.until.fn(This.callback.onViewClick)
		} else if(e.currentTarget.id == "setting") {
			This.getConfigPage()
			This.until.fn(This.callback.onSettingClick)
		}
	})
}

export default Head