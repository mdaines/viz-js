QUnit.module("memory");

var MEMORY_TEST_SRC = "digraph G{\n\ttype=\"digraph\";rankdir=\"TB\";use=\"dot\";ranksep=\"0.3\";\n\t949[fontname=\"Helvetica\",color=\"#000000\",shape=\"box\",label=\"S&#xa;n0\",fontcolor=\"#000000\",]\n\t950[fontname=\"Helvetica\",color=\"#000000\",shape=\"box\",label=\"S&#xa;n1\",fontcolor=\"#000000\",]\n\t951[fontname=\"Helvetica\",color=\"#00cc00\",shape=\"box\",label=\"R&#xa;n2\",fontcolor=\"#00cc00\",]\n\t949->944[fontname=\"Helvetica\",color=\"#000000\",weight=\"10\",constraint=\"true\",label=\"s&#xa;e0\",fontcolor=\"#000000\",]\n\t951->944[fontname=\"Helvetica\",color=\"#00cc00\",weight=\"1\",constraint=\"true\",label=\"ex&#xa;e1\",fontcolor=\"#00cc00\",]\n\t949->945[fontname=\"Helvetica\",color=\"#000000\",weight=\"10\",constraint=\"true\",label=\"pr&#xa;e2\",fontcolor=\"#000000\",]\n\t950->946[fontname=\"Helvetica\",color=\"#000000\",weight=\"10\",constraint=\"true\",label=\"aux&#xa;e3\",fontcolor=\"#000000\",]\n\t950->947[fontname=\"Helvetica\",color=\"#000000\",weight=\"10\",constraint=\"true\",label=\"s&#xa;e4\",fontcolor=\"#000000\",]\n\t951->947[fontname=\"Helvetica\",color=\"#00cc00\",weight=\"1\",constraint=\"true\",label=\"ex&#xa;e5\",fontcolor=\"#00cc00\",]\n\t950->948[fontname=\"Helvetica\",color=\"#000000\",weight=\"10\",constraint=\"true\",label=\"pr&#xa;e6\",fontcolor=\"#000000\",]\n\t949->950[fontname=\"Helvetica\",color=\"#00cc00\",weight=\"1\",constraint=\"true\",label=\"ad&#xa;rel: caus&#xa;e7\",fontcolor=\"#00cc00\",]\n\t944->945[style=\"invis\",weight=\"100\",]945->946[style=\"invis\",weight=\"100\",]946->947[style=\"invis\",weight=\"100\",]\n\t947->948[style=\"invis\",weight=\"100\",]\n\tsubgraph wnabyquvkgfmjxes{\n\t\trank=\"same\";\n\t\t944[fontname=\"Helvetica\",label=\"er&#xa;t0\",shape=\"box\",style=\"bold\",color=\"#000000\",fontcolor=\"#000000\",]\n\t\t945[fontname=\"Helvetica\",label=\"stirbt&#xa;t1\",shape=\"box\",style=\"bold\",color=\"#000000\",fontcolor=\"#000000\",]\n\t\t946[fontname=\"Helvetica\",label=\"weil&#xa;t2\",shape=\"box\",style=\"bold\",color=\"#000000\",fontcolor=\"#000000\",]\n\t\t947[fontname=\"Helvetica\",label=\"er&#xa;t3\",shape=\"box\",style=\"bold\",color=\"#000000\",fontcolor=\"#000000\",]\n\t\t948[fontname=\"Helvetica\",label=\"lacht&#xa;t4\",shape=\"box\",style=\"bold\",color=\"#000000\",fontcolor=\"#000000\",]\n\t}\n\tsubgraph vpmznchgjtuxbrfe{\n\t\t949[]\n\t\t950[]\n\t}\n\tsubgraph ohzxavtqesiunwlk{\n\t\t951[]\n\t}\n}";

QUnit.test("repeated invocations using setTimeout should not throw an error", function(assert) {
  var done = assert.async();
  
  var expected = 1000;
  var actual = 0;
  
  function f() {
    try {
      Viz(MEMORY_TEST_SRC);
    } catch (e) {
      done();
      return;
    }
    
    actual += 1;
    
    if (actual % 100 == 0) {
      console.log(actual);
    }
    
    if (actual == expected) {
      assert.ok(true);
      done();
      return;
    }
    
    setTimeout(f, 1);
  }
  
  f();
});
