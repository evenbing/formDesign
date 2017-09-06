const Body = function() {
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

}
export default Body