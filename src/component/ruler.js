const Ruler = function(){
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
}
export default Ruler