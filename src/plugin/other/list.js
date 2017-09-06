export default {
	type:"other",
	typeName:"高级插件",
	name:"list",
	text: "列表",
	template:
	`<div class="mes__formDesign_list mes__formDesign_resize horizontal" id="mes__list"  style="">
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

  script:
    `window.mes__list = {
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
}


