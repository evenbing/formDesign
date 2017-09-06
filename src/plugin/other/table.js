export default {
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
	script: 
`window.mes__table = {
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
}