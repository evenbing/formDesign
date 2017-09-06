const Setting = function() {
	this.$config = $(`<div class="modal fade" id="config">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title">设置</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal">
						<div class="modal-input">
							<div class="form-group">
							    <label for="firstname" class="col-sm-2 control-label">宽</label>
							    <div class="col-sm-10">
							      <input type="text" class="form-control" id="width" placeholder="请输入宽">
							    </div>
  							</div>
							<div class="form-group">
							    <label for="firstname" class="col-sm-2 control-label">高</label>
							    <div class="col-sm-10">
							      <input type="text" class="form-control" id="height" placeholder="请输入高">
							    </div>
  							</div>
						</div>
						<div class="modal-submit">
							<button type="button" class="btn btn-primary" id="confirm">确定</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>`)
	this.$body.append(this.$config)
	this.$config.delegate("#confirm", "click", {
		inthis: this
	}, function(e) {
		let This = e.data.inthis
		This.setConfigPage()
	})
}
export default Setting