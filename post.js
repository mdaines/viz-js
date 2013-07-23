  Module["ccall"]("vizRenderFromString", "number", ["string", "string"], [src, format]);
  return Module["return"];
};

// export both as package namespace and as function directly
if(typeof module !== "undefined" && module !== null && module["exports"] !== null){
	module["exports"] = viz["viz"] = viz["Viz"] = viz;
}else{
	this["viz"] = this["Viz"] = viz;
}

