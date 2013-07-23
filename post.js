  return Module["ccall"]("vizRenderFromString", "string", ["string", "string"], [src, format]);
};

// export both as package namespace and as function directly
if(typeof module !== "undefined" && module !== null && module["exports"] !== null){
	module["exports"] = viz["viz"] = viz["Viz"] = viz;
}else{
	this["viz"] = this["Viz"] = viz;
}

