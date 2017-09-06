const Javascript = function(){
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
}
export default Javascript