import FormDesign from "../formDesign.js"

import save from "./save"
import head from "./head"
import body from "./body"
import operate from "./operate"
import component from "./component"
import view from "./view"
import html from "./html"
import javascript from "./javascript"
import shadow from "./shadow"
import footer from "./footer"
import ruler from "./ruler"
import setting from "./setting"

function register(name, fun){
	FormDesign.prototype.registerComponent(name, fun)
}

register("save",save)
register("head",head)
register("body",body)
register("operate",operate)
register("component",component)
register("view",view)
register("html",html)
register("javascript",javascript)
register("shadow",shadow)
register("footer",footer)
register("ruler",ruler)
register("setting",setting)