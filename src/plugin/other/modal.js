export default {
	type:"other",
	typeName:"高级插件",
	name:"modal",
	text: "模态框",
	isContainer:true,
	template:
	`<div class="mes__formDesign_modal mes__formDesign_resize" id="mes__modal" style="">
	    <div class="head" style="">
	    	示例文字
	    	<span class="exit icon-remove-sign" onclick="window.mes__modal.hide()"></span>
	    </div>
	</div>`,
	script:
    `window.mes__modal = {
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
}
