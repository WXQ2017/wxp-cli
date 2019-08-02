module.exports = CONSTANT = {
  PAGE: {
    ORIGIN: "// WXQ-BUILD-PAGE # NOT DELETE",
    CONTENT:
      '// <%= lineClassName%> PAGE BEGIN\nexport function <%= className%>PagePreloading(): Promise<any> {\n  return import("./<%= lineClassName%>/<%= lineClassName%>.vue").catch(error => {\n    return dealOccurred(error, "<%= upCaseClassName%>");\n  });\n}\n// <%= lineClassName%> PAGE END',
  },
};
