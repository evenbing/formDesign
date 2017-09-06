import FormDesign from "../formDesign.js"
import "./assets/style.css"
import base_text from "./base/rect.js"
import base_word from "./base/word.js"
import base_label from "./base/label.js"
import base_input from "./base/input.js"
import base_button from "./base/button.js"
import base_select from "./base/select.js"
import base_checkbox from "./base/checkbox.js"
import base_textarea from "./base/textarea.js"

import combine_container from "./combine/container.js"
import combine_label from "./combine/label.js"
import combine_input from "./combine/input.js"
import combine_select from "./combine/select.js"

import other_tool from "./other/tool.js"
import other_alert from "./other/alert.js"
import other_list from "./other/list.js"
import other_table from "./other/table.js"
import other_modal from "./other/modal.js"


function register(obj){
	FormDesign.prototype.registerPlugin(obj)
}

register(base_text)
register(base_word)
register(base_label)
register(base_input)
register(base_button)
register(base_select)
register(base_checkbox)
register(base_textarea)

register(combine_container)
register(combine_label)
register(combine_input)
register(combine_select)

register(other_tool)
register(other_alert)
register(other_list)
register(other_table)
register(other_modal)

