const Footer = function(){
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
}
export default Footer