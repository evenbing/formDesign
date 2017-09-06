const Html = function(){
	this.$html = $(`<textarea id="html"></textarea>`)
				this.$body.find(".html").append(this.$html)
				this.$html_code = CodeMirror.fromTextArea(document.getElementById("html"), {
					lineNumbers: true,
					extraKeys: {
						"Ctrl": "autocomplete"
					},
					mode: "text/html"
				});
				this.$body.find(".html").hide()
}
export default Html