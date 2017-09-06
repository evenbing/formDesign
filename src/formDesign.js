//依赖[jquery,bootstrap,codemirror]
import "assets/codemirror/codemirror.js"
import "assets/codemirror/codemirror.css"
import "assets/codemirror/javascript.js"
import "assets/codemirror/xml.js"

import "./assets/style.css"

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
		fn: function(fun,param){
			if ((typeof fun) == "function") {
				return fun.apply(this, param?param:[]);
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
			if(offset){
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
						if(callback){
							callback();
						}
					}
				};
			} else {
				script.onload = function() {
					if(callback){
						callback();
					}
				};
			}
			script.src = url;
			win.document.body.appendChild(script);
		},
		loadJSMulti(win, urls, callback){
			let i=0;
			let load = (url) => {
				this.loadJS(win,url,function(){
					i++
					if(i<urls.length){
						load(urls[i])
					}
					else{
						callback()
					}
				})
			}
			load(urls[i])
		},
		loadCSS(win,url) {
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
		if(localStorage[cookieId]){
			this.$save.modal()
			$(".modal-backdrop").hide();
			this.$save.find(".confirm").one('click',  (e) => {
			 	let options = JSON.parse(localStorage[cookieId])
				for(let x in options) {
					this._property[x] = options[x]
				}
				this.importData(this._property.html, this._property.javascript)
			 	this.$save.modal("hide")
			})
			
			this.$save.one('hidden.bs.modal',  (e) => {
			 	this.$autosave = setInterval(()=>{
					localStorage[cookieId] = JSON.stringify(this.exportData(true))
				},5000)
				this.importData(this._property.html, this._property.javascript)
			})
		}
		else{
			this.$autosave = setInterval(()=>{
				localStorage[cookieId] = JSON.stringify(this.exportData(true))
			},5000)
		}
	},
	addNodes: function(json) {
		if(this.$mode != "view"){
			return false
		}
		if(json.left<0||json.top<0){
			return false
		}
		if(json.containerid){
			let dom = $(
	`<div class="nodes${this.pluginAll[json.name].isContainer?" isContainer":""}" id="${json.id}" containerid="${json.containerid}">
	${this.pluginAll[json.name].template}
</div>`)
			dom.css({
				left: json.left,
				top: json.top,
				position: "absolute"
			})
			this.$view.find("#"+json.containerid).children().append(dom)
			this.$view.find("#"+json.containerid).children().append("\n")
		}
		else{
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
		if(script){
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
		if(dom.find(".mes__formDesign_resize").length>0){
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
		if(!keep){
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
		
		this.until.loadCSS(newWin,window.location.origin + "/form/style.css")
		this.until.loadCSS(newWin,"https://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css")
		this.until.loadJSMulti(newWin,["https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js","https://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"],function(){
			let js = document.createElement("script")
			js.type = "text/javascript";
			js.appendChild(document.createTextNode(js_code));
			newWin.document.body.appendChild(js)
		})
	},
	getConfigPage: function(){
		this.$config.find("#height").val(this.$workInner.height())
		this.$config.find("#width").val(this.$workInner.width())
		this.$config.modal();
		$(".modal-backdrop").hide();
	},
	setConfigPage: function(){
		let width = this.$config.find("#width").val()
		let height = this.$config.find("#height").val()
		this.changeTitleSize(width,height)
		this.$workInner.css({
			width: width,
			height: height
		})
		this.$config.modal("hide")
	},
	changeTitleSize: function(width,height){
		this.$head.find(".size").html(`(${width} X ${height})`)
	},
	initContainer: function(){
		this.$containerData = {}
		this.$view.find(".isContainer").each((index,dom)=>{
			let left = this.getRealPosition(dom.id).left
			let top = this.getRealPosition(dom.id).top
			this.$containerData[dom.id] = {
				left:left,
				right:left+$(dom).width(),
				top:top,
				bottom:top+$(dom).height()
			}
		})
	},
	inContainer: function(left,top){
		let obj = {}
		let dis = false, id = false
		function inRange(data,d1,d2){
			return (data>d1)&&(data<d2)
		}
		for(let x in this.$containerData){
			let l = this.$containerData[x].left
			let r = this.$containerData[x].right
			let t = this.$containerData[x].top
			let b = this.$containerData[x].bottom
			if(inRange(left,l,r)&&inRange(top,t,b)){
				obj[x] = (left-l)+(top-t)
			}
		}
		for(let x in obj){
			if(!id){
				id = x
				dis = obj[x]
			}
			else if(obj[x]<dis){
				id = x
				dis = obj[x]
			}
		}
		return id
	},
	getRealPosition: function(id){
		let This = this
		let left = 0,top=0
		do {
		    left += parseInt(This.$view.find("#"+id).css("left"))
			top += parseInt(This.$view.find("#"+id).css("top"))
		    id = This.$view.find("#"+id).attr("containerid")
		}
		while (id);
		
		return {
			left:left,
			top:top
		}
	},
	getRelativePosition: function(id){
		let This = this
		let left = 0,top=0
		let containerid = This.$view.find("#"+id).attr("containerid")
		while (containerid){
			left += parseInt(This.$view.find("#"+containerid).css("left"))
			top += parseInt(This.$view.find("#"+containerid).css("top"))
			containerid = This.$view.find("#"+containerid).attr("containerid")
		}
		return {
			left:left,
			top:top
		}
	}
}

//组件定义
FormDesign.prototype.render = {}
//组件注册
FormDesign.prototype.registerComponent = function(name,fun) {
	this.render[name] = fun
}

//插件定义
FormDesign.prototype.plugin = {}
FormDesign.prototype.pluginAll = {}
//插件注册
FormDesign.prototype.registerPlugin = function(obj) {
	let type = obj.type
	let name = obj.name
	name = type+"_"+name
	if(this.pluginAll[name]){
		console.warn(`${obj.type}类型下已包含名为${obj.name}的插件,如需强制注册请使用registerPluginForce方法`)
	}
	else{
		if(!this.plugin[type]){
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
	name = type+"_"+name
	this.plugin[type][name] = obj
	this.pluginAll[name] = obj
}
export default FormDesign