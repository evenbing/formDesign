! function(context) {
	function FormDesign(obj, property) {
		this.$container = obj
		this.$container.attr("id", "formDesign")
		this.$mode = "view"
		this.$autosave = null
		this.$containerData = {}
		this.$offsetWidth = 0
		this.$offsetHeight = 0
		this._property = property //配置属性
		let defaultProperty = {
			formId: "001",
			title: "1号产线质量检测图",
			html: "",
			javascript: "",
			height: 900,
			width: 1440
		}
		for(let x in defaultProperty) {
			if(!this._property[x]) {
				this._property[x] = defaultProperty[x]
			}
		}
	}

	FormDesign.prototype = {
		until: {
			fn: function(fun, param) {
				if((typeof fun) == "function") {
					return fun.apply(this, param ? param : []);
				}
			},
			mousePosition: function(ev) {
				if(!ev) ev = window.event;
				if(ev.pageX || ev.pageY) {
					return {
						x: ev.pageX,
						y: ev.pageY
					};
				}
				return {
					x: ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
					y: ev.clientY + document.documentElement.scrollTop - document.body.clientTop
				};
			},
			mouseRoundPosition: function(ev, pos, offset) {
				let _pos = this.mousePosition(ev)
				if(offset) {
					_pos.x = _pos.x - offset.x
					_pos.y = _pos.y - offset.y
				}
				if(this.remainder(_pos.x - pos.left) < 10) {
					_pos.x = this.rounding(_pos.x - pos.left) + pos.left
				}
				if(this.remainder(_pos.y - pos.top) < 10) {
					_pos.y = this.rounding(_pos.y - pos.top) + pos.top
				}
				return _pos
			},
			getElCoordinate(dom) {
				let t = dom.offsetTop;
				let l = dom.offsetLeft;
				dom = dom.offsetParent;
				while(dom) {
					if(dom.id == "formDesign") {
						dom = false
					} else {
						t += dom.offsetTop;
						l += dom.offsetLeft;
						dom = dom.offsetParent;
					}

				};
				return {
					top: t,
					left: l
				};
			},
			rounding(num) {
				return parseInt(num / 10) * 10
			},
			remainder(num) {
				return num - this.rounding(num)
			},
			loadJS(win, url, callback) {
				let script = document.createElement("script");
				script.type = "text/javascript";
				if(script.readyState) {
					script.onreadystatechange = function() {
						if(script.readyState == "loaded" ||
							script.readyState == "complete") {
							script.onreadystatechange = null;
							if(callback) {
								callback();
							}
						}
					};
				} else {
					script.onload = function() {
						if(callback) {
							callback();
						}
					};
				}
				script.src = url;
				win.document.body.appendChild(script);
			},
			loadJSMulti(win, urls, callback) {
				let i = 0;
				let load = (url) => {
					this.loadJS(win, url, function() {
						i++
						if(i < urls.length) {
							load(urls[i])
						} else {
							callback()
						}
					})
				}
				load(urls[i])
			},
			loadCSS(win, url) {
				let csslink = document.createElement("link");
				csslink.rel = "stylesheet";
				csslink.type = "text/css";
				csslink.href = url;
				win.document.getElementsByTagName('head')[0].appendChild(csslink);
			}
		},
		callback: {
			onSaveClick: () => {},
			onViewClick: () => {},
			onSettingClick: () => {},
			onCloseClick: () => {}
		},
		init: function() {
			for(let x in this.render) {
				let fun = this.render[x]
				fun.bind(this)()
			}
			this.importData(this._property.html, this._property.javascript)
			let cookieId = "formDesigner_" + this._property.formId
			if(localStorage[cookieId]) {
				this.$save.modal()
				$(".modal-backdrop").hide();
				this.$save.find(".confirm").one('click', (e) => {
					let options = JSON.parse(localStorage[cookieId])
					for(let x in options) {
						this._property[x] = options[x]
					}
					this.importData(this._property.html, this._property.javascript)
					this.$save.modal("hide")
				})

				this.$save.one('hidden.bs.modal', (e) => {
					this.$autosave = setInterval(() => {
						localStorage[cookieId] = JSON.stringify(this.exportData(true))
					}, 5000)
					this.importData(this._property.html, this._property.javascript)
				})
			} else {
				this.$autosave = setInterval(() => {
					localStorage[cookieId] = JSON.stringify(this.exportData(true))
				}, 5000)
			}
		},
		addNodes: function(json) {
			if(this.$mode != "view") {
				return false
			}
			if(json.left < 0 || json.top < 0) {
				return false
			}
			if(json.containerid) {
				let dom = $(
					`<div class="nodes${this.pluginAll[json.name].isContainer?" isContainer":""}" id="${json.id}" containerid="${json.containerid}">
	${this.pluginAll[json.name].template}
</div>`)
				dom.css({
					left: json.left,
					top: json.top,
					position: "absolute"
				})
				this.$view.find("#" + json.containerid).children().append(dom)
				this.$view.find("#" + json.containerid).children().append("\n")
			} else {
				let dom = $(
					`<div class="nodes${this.pluginAll[json.name].isContainer?" isContainer":""}" id="${json.id}">
	${this.pluginAll[json.name].template}
</div>`)
				dom.css({
					left: json.left,
					top: json.top,
					position: "absolute"
				})
				this.$view.append("\n")
				this.$view.append(dom)
			}

			let script = this.pluginAll[json.name].script
			if(script) {
				this.$body.find(".javascript").toggle()
				this.$javascript_code.setValue(this.$javascript_code.getValue() + "\n" + script)
				this.$body.find(".javascript").toggle()
			}
			this.focusNodes(json.id)
		},
		deleteNodes: function(id) {
			$(`#${id}`).remove()
		},
		focusNodes: function(id) {
			this.blurNodes()
			this.$focus = id
			let dom = $(`#${id}`)
			dom.addClass("active")
			dom.append(`<div class='delete delFlag'><span class="glyphicon glyphicon-remove"></span></div>`)
			if(dom.find(".mes__formDesign_resize").length > 0) {
				dom.append(`<div class='resize'><span class="resizeIcon"></span></div>`)
			}
		},
		blurNodes: function() {
			this.$focus = null
			$(".nodes").removeClass("active")
			$(".nodes .delete").remove()
			$(".nodes .resize").remove()
		},
		importData: function(html, javascript) {
			this.$body.find(".html").show()
			this.$body.find(".javascript").show()
			this.$html_code.setValue(html)
			this.$javascript_code.setValue(javascript)
			this.$body.find(".view .workArea .workInner .work").html(html)

			this.$body.find(".html").hide()
			this.$body.find(".javascript").hide()
		},
		exportData: function(keep) {
			this.syncView(keep)
			return {
				html: this.$html_code.getValue(),
				javascript: this.$javascript_code.getValue(),
				width: parseInt(this.$workInner.width()),
				height: parseInt(this.$workInner.height())
			}
		},
		syncView: function(keep) {
			if(!keep) {
				this.blurNodes()
			}
			if(this.$mode == "view") {
				this.$body.find(".html").show()
				this.$html_code.setValue(this.$body.find(".view .workArea .workInner .work").html())
				this.$body.find(".html").hide()
			} else if(this.$mode == "html") {
				this.$body.find(".view .workArea .workInner .work").html(this.$html_code.getValue())
			} else if(this.$mode == "javascript") {

			}
		},
		viewHtml: function() {
			this.blurNodes()
			this.syncView()
			let newWin = open("", "", `height=${this.$workInner.height()}, width=${this.$workInner.width()}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`);
			let html_code = this.$html_code.getValue()
			let js_code = this.$javascript_code.getValue()

			newWin.document.body.innerHTML = `<div class="work" 
		style="height:${this.$workInner.height()}px;
		width:${this.$workInner.width()}px;"
		>${html_code}</div>`

			this.until.loadCSS(newWin, "/libs/formDesign/style.css")
			this.until.loadCSS(newWin, "https://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css")
			this.until.loadJSMulti(newWin, ["https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js", "https://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"], function() {
				let js = document.createElement("script")
				js.type = "text/javascript";
				js.appendChild(document.createTextNode(js_code));
				newWin.document.body.appendChild(js)
			})
		},
		getConfigPage: function() {
			this.$config.find("#height").val(this.$workInner.height())
			this.$config.find("#width").val(this.$workInner.width())
			this.$config.modal();
			$(".modal-backdrop").hide();
		},
		setConfigPage: function() {
			let width = this.$config.find("#width").val()
			let height = this.$config.find("#height").val()
			this.changeTitleSize(width, height)
			this.$workInner.css({
				width: width,
				height: height
			})
			this.$config.modal("hide")
		},
		changeTitleSize: function(width, height) {
			this.$head.find(".size").html(`(${width} X ${height})`)
		},
		initContainer: function() {
			this.$containerData = {}
			this.$view.find(".isContainer").each((index, dom) => {
				let left = this.getRealPosition(dom.id).left
				let top = this.getRealPosition(dom.id).top
				this.$containerData[dom.id] = {
					left: left,
					right: left + $(dom).width(),
					top: top,
					bottom: top + $(dom).height()
				}
			})
		},
		inContainer: function(left, top) {
			let obj = {}
			let dis = false,
				id = false

			function inRange(data, d1, d2) {
				return(data > d1) && (data < d2)
			}
			for(let x in this.$containerData) {
				let l = this.$containerData[x].left
				let r = this.$containerData[x].right
				let t = this.$containerData[x].top
				let b = this.$containerData[x].bottom
				if(inRange(left, l, r) && inRange(top, t, b)) {
					obj[x] = (left - l) + (top - t)
				}
			}
			for(let x in obj) {
				if(!id) {
					id = x
					dis = obj[x]
				} else if(obj[x] < dis) {
					id = x
					dis = obj[x]
				}
			}
			return id
		},
		getRealPosition: function(id) {
			let This = this
			let left = 0,
				top = 0
			do {
				left += parseInt(This.$view.find("#" + id).css("left"))
				top += parseInt(This.$view.find("#" + id).css("top"))
				id = This.$view.find("#" + id).attr("containerid")
			}
			while (id);

			return {
				left: left,
				top: top
			}
		},
		getRelativePosition: function(id) {
			let This = this
			let left = 0,
				top = 0
			let containerid = This.$view.find("#" + id).attr("containerid")
			while(containerid) {
				left += parseInt(This.$view.find("#" + containerid).css("left"))
				top += parseInt(This.$view.find("#" + containerid).css("top"))
				containerid = This.$view.find("#" + containerid).attr("containerid")
			}
			return {
				left: left,
				top: top
			}
		}
	}

	//组件定义
	FormDesign.prototype.render = {}
	//组件注册
	FormDesign.prototype.registerComponent = function(name, fun) {
		this.render[name] = fun
	}

	//插件定义
	FormDesign.prototype.plugin = {}
	FormDesign.prototype.pluginAll = {}
	//插件注册
	FormDesign.prototype.registerPlugin = function(obj) {
		let type = obj.type
		let name = obj.name
		name = type + "_" + name
		if(this.pluginAll[name]) {
			console.warn(`${obj.type}类型下已包含名为${obj.name}的插件,如需强制注册请使用registerPluginForce方法`)
		} else {
			if(!this.plugin[type]) {
				this.plugin[type] = {}
			}
			this.plugin[type][name] = obj
			this.pluginAll[name] = obj
		}
	}
	//卸载默认组件
	FormDesign.prototype.uninstallPlugin = function() {
		this.plugin = {}
		this.pluginAll = {}
	}
	//插件强制注册
	FormDesign.prototype.registerPluginForce = function(obj) {
		let type = obj.type
		let name = obj.name
		name = type + "_" + name
		this.plugin[type][name] = obj
		this.pluginAll[name] = obj
	}

	//注册组件插件
	let component = {
		body: function() {
			this.$body =
				$(`<div class="body"  ondragstart="return false">
							<div class="component">
								<div class="title">
									
								</div>
								<div class="head">
									<ul class="nav nav-tabs">
										<li class="active">
											<a href="#base" data-toggle="tab">
												<span class="glyphicon glyphicon-briefcase"></span>
											</a>
										</li>
										<li>
											<a href="#combine" data-toggle="tab">
												<span class="glyphicon glyphicon-list-alt"></span>
											</a>
										</li>
										<li>
											<a href="#template" data-toggle="tab">
												<span class="glyphicon glyphicon-th-large"></span>
											</a>
										</li>
									</ul>
								</div>
								<div class="content">
									
								</div>
							</div>
							<div class="view">
								<div class='workArea'>
									
								</div>
							</div>
							<div class="html"></div>
							<div class="javascript"></div>
							<div class="footer"></div>
						</div>`)
			this.$container.append(this.$body)
			this.$offsetWidth = parseInt(this.$body.find(".component").css("width"))
		},
		component: function() {
			let tpl = () => {
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
				window.onmousemove = function(e) {
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
				}
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
		},
		footer: function() {
			this.$footer = $(`<ul>
								<li class="active" id="view">设计</li>
								<li id="html">HTML</li>
								<li id="javascript">JavaScript</li>
							</ul>`)
			this.$body.find(".footer").append(this.$footer)
			this.$footer.delegate("li", "click", {
				inthis: this
			}, function(e) {
				let This = e.data.inthis
				let mode = e.currentTarget.id
				if(mode == This.$mode) {
					return false
				}
				This.$body.find(".view").hide()
				This.$body.find(".html").hide()
				This.$body.find(".javascript").hide()
				This.$footer.find("li").removeClass("active")
				This.syncView()
				if(mode == "view") {
					This.$mode = "view"
					This.$body.find(".view").show()
					$(e.currentTarget).addClass("active")
				} else if(mode == "html") {
					This.$mode = "html"
					This.$body.find(".html").show()
					$(e.currentTarget).addClass("active")
				} else if(mode == "javascript") {
					This.$mode = "javascript"
					This.$body.find(".javascript").show()
					$(e.currentTarget).addClass("active")
				}
			})
		},
		head: function() {
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
		},
		html: function() {
			this.$html = $(`<textarea id="html"></textarea>`)
			this.$body.find(".html").append(this.$html)
			this.$html_code = CodeMirror.fromTextArea(document.getElementById("html"), {
				Numbers: true,
				extraKeys: {
					"Ctrl": "autocomplete"
				},
				mode: "text/html"
			});
			this.$body.find(".html").hide()
		},
		javascript: function() {
			this.$javascript = $(`<textarea id="javascript"></textarea>`)
			this.$body.find(".javascript").append(this.$javascript)
			this.$javascript_code = CodeMirror.fromTextArea(document.getElementById("javascript"), {
				lineNumbers: true,
				extraKeys: {
					"Ctrl": "autocomplete"
				},
				mode: "javascript"
			});
			this.$body.find(".javascript").hide()
		},
		operate: function() {
			this.$operate = $(
				`<ul>
			<li><span class="glyphicon glyphicon-retweet"></span></li>
			<li><span class="glyphicon glyphicon-file"></span></li>
			<li><span class="glyphicon glyphicon-duplicate"></span></li>
			<li><span class="glyphicon glyphicon-arrow-left"></span></li>
			<li><span class="glyphicon glyphicon-arrow-right">
		</ul>`)
			this.$body.find(".title").append(this.$operate)
		},
		ruler: function() {
			function getCount(num) {
				return Math.ceil(((num) - 25) / 100)
			}

			function calculate(num, count) {
				let str = ""
				for(let i = 0; i < count; i++) {
					str += `<li><ul class="dot"><span>${i*100}</span><li></li><li></li><li></li><li></li></ul></li>`
				}
				return `<ul>${str}</ul>`
			}
			let count = getCount(2000)
			let topRuler = $("<div class='topRuler'></div>")
			this.$body.find(".view").append(topRuler)
			this.$topRulerDash = $("<div class='topRulerDash'></div>")
			this.$body.find(".view").append(this.$topRulerDash)

			topRuler.append(calculate(2000, count))
			topRuler.find("ul").css({
				width: 100 * count + 25
			})
			let leftRuler = $("<div class='leftRuler'></div>")
			this.$body.find(".view").append(leftRuler)
			this.$leftRulerDash = $("<div class='leftRulerDash'></div>")
			this.$body.find(".view").append(this.$leftRulerDash)

			leftRuler.append(calculate(2000, count))
			leftRuler.find("ul").css({
				height: 100 * count + 25
			})
		},
		save: function() {
			this.$save =
				$(`<div class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title">读取缓存</h4>
	      </div>
	      <div class="modal-body">
	        <p>是否恢复到上次离开时候的状态?</p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
	        <button type="button" class="btn btn-primary confirm">确定</button>
	      </div>
	    </div>
	  </div>
	</div>`)
			this.$container.append(this.$save)
		},
		setting: function() {
			this.$config = $(`<div class="modal fade" id="config">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title">设置</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal">
						<div class="modal-input">
							<div class="form-group">
							    <label for="firstname" class="col-sm-2 control-label">宽</label>
							    <div class="col-sm-10">
							      <input type="text" class="form-control" id="width" placeholder="请输入宽">
							    </div>
  							</div>
							<div class="form-group">
							    <label for="firstname" class="col-sm-2 control-label">高</label>
							    <div class="col-sm-10">
							      <input type="text" class="form-control" id="height" placeholder="请输入高">
							    </div>
  							</div>
						</div>
						<div class="modal-submit">
							<button type="button" class="btn btn-primary" id="confirm">确定</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>`)
			this.$body.append(this.$config)
			this.$config.delegate("#confirm", "click", {
				inthis: this
			}, function(e) {
				let This = e.data.inthis
				This.setConfigPage()
			})
		},
		shadow: function() {
			this.$shadow = $(`<div class="shadow"></div>`)
			this.$body.append(this.$shadow)
		},
		view: function() {
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
				let X, Y
				window.onmousemove = function(e) {
					let mouse_pos = This.until.mousePosition(e)
					X = mouse_pos.x - dom_pos.left < 0 ? 0 : mouse_pos.x - dom_pos.left
					Y = mouse_pos.y - dom_pos.top < 0 ? 0 : mouse_pos.y - dom_pos.top
					dom.css({
						width: X,
						height: Y
					})
					This.changeTitleSize(X, Y)
				}
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
				if($(e.target).className == "resize" || $(e.target).parent(".resize").length > 0) {
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

				window.onmousemove = function(e) {
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
				}
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
				if(dom.hasClass("horizontal")) {
					mode = "horizontal"
				} else if(dom.hasClass("vertical")) {
					mode = "vertical"
				} else {
					mode = "both"
				}
				let dom_pos = This.until.getElCoordinate(dom[0])
				let X, Y
				window.onmousemove = function(e) {
					let mouse_pos = This.until.mousePosition(e)
					X = mouse_pos.x - dom_pos.left < 0 ? 0 : mouse_pos.x - dom_pos.left
					Y = mouse_pos.y - dom_pos.top < 0 ? 0 : mouse_pos.y - dom_pos.top
					let stl = {}
					if(mode == "horizontal") {
						stl = {
							width: X
						}
					} else if(mode == "vertical") {
						stl = {
							height: Y
						}
					} else if(mode == "both") {
						stl = {
							width: X,
							height: Y
						}
					}
					dom.css(stl)
				}
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
	}

	let plugin = [{
			type: "default",
			typeName: "默认组件",
			name: "button",
			text: "按钮",
			template: `<button class="mes__formDesign_button mes__formDesign_primary" style="">按钮示例</button>`
		}, {
			type: "default",
			typeName: "默认组件",
			name: "checkbox",
			text: "复选框",
			template: `<input class="mes__formDesign_checkbox" type="checkbox" style="">`
		},
		{
			type: "default",
			typeName: "默认组件",
			name: "input",
			text: "输入框",
			template: `<div class="mes__formDesign_input" style="">
	   <input class="mes__formDesign_input_inner" style="" placeholder="请输入关键字">
	</div>`
		}, {
			type: "default",
			typeName: "默认组件",
			name: "label",
			text: "标签",
			template: `<span class="mes__formDesign_label" style="">文字示例</span>`
		}, {
			type: "default",
			typeName: "默认组件",
			name: "rectangle",
			text: "方框",
			isContainer: true,
			template: `<div class="mes__formDesign_rect mes__formDesign_resize" style=""></div>`
		}, {
			type: "default",
			typeName: "默认组件",
			name: "select",
			text: "下拉框",
			template: `<select class="mes__formDesign_select" style="">
	   <option  value="选项一">选项一</option>
		 <option  value="选项二">选项二</option>
	</select>`
		}, {
			type: "default",
			typeName: "默认组件",
			name: "textarea",
			text: "文本域",
			template: `<textarea class="mes__formDesign_textarea mes__formDesign_resize" placeholder="请输入内容" style=""></textarea>`
		}, {
			type: "default",
			typeName: "默认组件",
			name: "word",
			text: "文字",
			template: `<span class="mes__formDesign_word" style="">文字示例</span>`
		},
		{
			type: "combine",
			typeName: "组合插件",
			name: "container",
			text: "容器",
			isContainer: true,
			template: `<div class="mes__formDesign_container mes__formDesign_resize" style="">
		<div class="border" style=""></div>
		<span class="mes__formDesign_label" style="">文字示例</span>
	</div>`
		}, {
			type: "combine",
			typeName: "组合插件",
			name: "input",
			text: "组合输入",
			template: `<div class="mes__formDesign_input_com" style="">
		<span class="mes__formDesign_word" style="">文字示例</span>
		<div class="mes__formDesign_input" style="">
		   <input class="mes__formDesign_input_inner" style="" placeholder="请输入关键字">
		</div>
	</div>`
		}, {
			type: "combine",
			typeName: "组合插件",
			name: "label",
			text: "标签",
			template: `<div class="mes__formDesign_label_com mes__formDesign_primary" style="">
    <span class="word" style="">文字示例</span>
    <span class="number" style="">1000</span>
	</div>`
		},
		{
			type: "combine",
			typeName: "组合插件",
			name: "select",
			text: "组合下拉",
			template: `<div class="mes__formDesign_select_com" style="">
		<span class="mes__formDesign_word" style="">文字示例</span>
		<select class="mes__formDesign_select" style="">
	   <option  value="选项一">选项一</option>
		 <option  value="选项二">选项二</option>
	</select>
	</div>`
		}, {
			type: "other",
			typeName: "高级插件",
			name: "alert",
			text: "警告框",
			template: `<div class="mes__formDesign_alert mes__formDesign_resize horizontal mes__formDesign_warning"  style="">
    <span style="">文字示例</span>
	</div>`
		},
		{
			type: "other",
			typeName: "高级插件",
			name: "list",
			text: "列表",
			template: `<div class="mes__formDesign_list mes__formDesign_resize horizontal" id="mes__list"  style="">
    	<ul class="list">
    		<li>
    			<div class="key">key1</div>
    			<div class="value">value1</div>
    		</li>
    		<li>
    			<div class="key">key2</div>
    			<div class="value">value2</div>
    		</li>
    		<li>
    			<div class="key">key3</div>
    			<div class="value">value3</div>
    		</li>
    	</ul>
	</div>`,

			script: `window.mes__list = {
    /*
	 * loadData()方法实现加载list的数据列表
	 * arr数组中数据格式为:[{name:'key',value:'1'},{name:'key2',value:'2'}]
	 */
	loadData: function(arr){
		$("#mes__list .list").empty()
	    var htmlString = ""
	    arr.forEach(function(val){
	        htmlString+= '<li><div class="key">'+val.name+'</div><div class="value">'+val.value+'</div></li>'
	    })
		$("#mes__list .list").append(htmlString)
	}
}`
		}, {
			type: "other",
			typeName: "高级插件",
			name: "modal",
			text: "模态框",
			isContainer: true,
			template: `<div class="mes__formDesign_modal mes__formDesign_resize" id="mes__modal" style="">
	    <div class="head" style="">
	    	示例文字
	    	<span class="exit icon-remove-sign" onclick="window.mes__modal.hide()"></span>
	    </div>
	</div>`,
			script: `window.mes__modal = {
	/*
	 * 初始化模态框
	 */
	init: function(){
        $("#mes__modal").hide()
	},
    /*
	 * show方法显示模态框
	 */
	show: function(){
		$("body").append('<div class="mes__modal__mask"></div>')
		$("#mes__modal").css({"z-index":1050,"display":"block","top":"-100%"})
		$("#mes__modal").animate({"top":"0"},300)
	},
    /*
	 * show方法隐藏模态框
	 */
	hide: function(){
		$(".mes__modal__mask").remove()
		$("#mes__modal").animate({"top":"-100%"},300,"linear",function(){
        	$("#mes__modal").css({"z-index":"auto","display":"none"})
        })
		
	}
}

window.mes__modal.init()
`
		}, {
			type: "other",
			typeName: "高级插件",
			name: "table",
			text: "表格",
			template: `<div class="mes__formDesign_table mes__formDesign_resize horizontal" id="mes__table" style="width: 893px;">
          <div class="mes__formDesign_table_head" style="padding-right:18px">
          <table>
              <thead>
                  <tr>
                    <th>无数据</th>
                  </tr>
              </thead>
          </table>
        </div>
      	<div class="mes__formDesign_table_body" style="max-height: 230px">
          <table>
                <tbody>
                    <tr>
                      <td>无数据</td>
                    </tr>
                </tbody>
            </table>
          </div>
        <nav>
            <ul class="pager">
              <li class="previous" style="cursor:pointer" onclick="mes__table.previous()">
                  <a><span>←</span> 上一页</a>
              </li>
              <li class="next" style="cursor:pointer" onclick="mes__table.next()">
                  <a>下一页 <span aria-hidden="true">→</span></a>
              </li>
            </ul>
         </nav>
	</div>`,
			script: `window.mes__table = {
  	pageSize:10,
  	pageNum:1,
  	data:[],
  	formOption:[{
      prop: "sN",
      label: "SN"
    },{
      prop: "createDate",
      label: "创建时间"
    }],
    /*
	 * 加载表格的数据列表
	 * 参数:
	 * option 表头中文与字段key对应数组 例:[{ prop: "name1",label: "字段名称一"},{ prop: "name2",label: "字段名称二"}]
	 * data 列表数据数组 例:[{name1:'1',name2:1},{name1:'2',name2:2},{name1:'3',name2:3}]
	 * mes__table.loadData([{ prop: "name1",label: "字段名称一"},{ prop: "name2",label: "字段名称二"}],[{name1:'1',name2:1},{name1:'2',name2:2},{name1:'3',name2:3}])
	 */
	loadData: function(option,data){
	    var headString = "<th>序号</th>";
	    var bodyString = "";
	    var head = ['$index']
	    option.forEach(function(val){
        	headString+= '<th>'+val.label+'</th>'
        	head.push(val.prop)
		})
        data.forEach(function(val,index){
        	bodyString+= ('<tr id=' + val.id + '>' +
        	(function(data){
	            var string = "";
	            head.forEach(function(val){
	            	if(val == '$index'){
	            		string+='<td class="mes__table__index">'+(index+1)+'</td>'
	            	}
	            	else{
	            		string+='<td>'+(data[val]||"")+'</td>'
	            	}
	               
	            })
	            return string
        	})(val)
            +'</tr>')
		})
		$("#mes__table thead tr").html(headString);
		$("#mes__table tbody").html(bodyString);
      	this.data = data
      	this.checkbox()
      	this.operate()
	},
	refreshPage: function(total){
  		if(this.pageNum==1){
  			$("#mes__table .previous").hide()
  		}
  		else{
  			$("#mes__table .previous").show()
  		}
  		if(this.pageNum*this.pageSize>total){
  			$("#mes__table .next").hide()
  		}
  		else{
  			$("#mes__table .next").show()
  		}
	},
	previous: function(){
      	this.pageNum--
		this.queryData()
	},
	next: function(){
      	this.pageNum++
		this.queryData()
	},
  	queryData: function(){
  		/*
          	//do somethis
	    	window.mes_form_main.post("/mes/pdproductinfo/byPage",{
	          pageNum:this.pageNum,
	          pageSize:this.pageSize,
	          condition:{
	             workOrderId:window.mes_form_main.info.workOrder.id
	          }
	        },(res)=>{
	            this.loadData(this.formOption,res.content.rows)
	            $(".opNum").html(res.content.total)
	            $(".rtNum").html(window.mes_form_main.info.workOrder.workOrderTotal - res.content.total)
	      		this.refreshPage(res.content.total)
	        })
	    */
    },
	/*
	 * 追加操作列并添加自定义模板
	 */
	operate: function(){
      	var This = this
	    $("#mes__table thead tr").append('<th style="width:200px">操作</th>')
	    $("#mes__table tbody tr").each(function(index,dom){
          	/*
          		//do somethis
	          	var status = This.getData(dom.id).status
	            var template = ""
	            if(status == 2){
	            	template ='<button class="mes__formDesign_button tiny" style="">良品</button>'+
	              '<button class="mes__formDesign_button mes__formDesign_danger tiny" style="cursor:not-allowed">不良品</button>'
	            }
	            else if(status == 3){
	            	template = '<button class="mes__formDesign_button mes__formDesign_success tiny" style="cursor:not-allowed">良品</button>'+
	              '<button class="mes__formDesign_button tiny" style="">不良品</button>'
	            }
	            else{
	            	template = '<button class="mes__formDesign_button tiny">良品</button><button class="mes__formDesign_button tiny" style="">不良品</button>'
	            }
		    	$(this).append("<td style='width:200px' data="+ dom.id +">"+template+"</td>")
	    	*/
	    })
	},
	/*
	 * 追加多选框
	 * mes__table.operate('<span class="icon-eye-open"></span>')
	 */
	checkbox:function(){
        var cbk = '<input type="checkbox"/>'
	    $(".mes__table__index").each(function(index,dom){
	    	$(this).html(cbk+$(this).html())
	    })
	},
  	getData: function(id){
      	var res = null
    	this.data.forEach(function(val){
        	if(val.id == id){
        		res = val
        	}                  
        })
  		return res
    }
}`
		}, {
			type: "other",
			typeName: "高级插件",
			name: "tool",
			text: "工具栏",
			template: `<div class="mes__formDesign_tool mes__formDesign_resize horizontal" style="" id="mes__tool">
		<div class="mes__formDesign_input_com pd" style="">
			<span class="mes__formDesign_word" style="">产品条码</span>
			<div class="mes__formDesign_input" style="">
			   <input class="mes__formDesign_input_inner mes__tool__pdCode" style="" placeholder="请输入关键字" onkeypress="return mes__tool.submit(event)">
			</div>
		</div>
		<div class="mes__formDesign_input_com button" style="">
			<button class="mes__formDesign_button mes__formDesign_primary" style=""  onclick="mes__tool.submit()">确定</button>
		</div>
		<div class="mes__formDesign_input_com" style="">
			<span class="mes__formDesign_word small" style="">联板数量</span>
			<div class="mes__formDesign_input tiny" style="">
			   <input class="mes__formDesign_input_inner mes__tool__plate" style="" disabled>
			</div>
		</div>
	</div>`,
			script: `
window.mes__tool = {
	/*
	 * 点击提交执行函数
	 */
	submit: function(){
		if(!e || e.keyCode == 13){
			
        }
	}
}
`
		}

	]

	for(let x in component) {
		FormDesign.prototype.registerComponent(x, component[x])
	}

	plugin.forEach((val) => {
		FormDesign.prototype.registerPlugin(val)
	})

	context.FormDesign = FormDesign
}(window)