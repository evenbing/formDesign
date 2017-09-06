const Operate = function(){
	this.$operate = $(
					`<ul>
						<li><span class="glyphicon glyphicon-retweet"></span></li>
						<li><span class="glyphicon glyphicon-file"></span></li>
						<li><span class="glyphicon glyphicon-duplicate"></span></li>
						<li><span class="glyphicon glyphicon-arrow-left"></span></li>
						<li><span class="glyphicon glyphicon-arrow-right">
					</ul>`)
				this.$body.find(".title").append(this.$operate)
}
export default Operate