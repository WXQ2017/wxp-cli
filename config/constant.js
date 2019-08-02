module.exports = CONSTANT = {
  PAGE: {
    ORIGIN: "// WXQ-BUILD-PAGE # NOT DELETE",
    CONTENT:
      '// <%= lineClassName%> PAGE BEGIN\nexport function <%= className%>PagePreloading(): Promise<any> {\n  return import("./<%= lineClassName%>/<%= lineClassName%>.vue").catch(error => {\n    return dealWithError(error, "<%= upCaseClassName%>");\n  });\n}\n// <%= lineClassName%> PAGE END',
    ROUTER_ORIGIN: "// WXQ-BUILD-ROUTER-PAGE # NOT DELETE",
    ROUTER_CONTENT:
      '  {\n    component: PageLoading.<%= className%>PagePreloading,\n    name: "<%= upCaseClassName%>",\n    path: "/<%= lowLineClassName%>",\n  },',
  },
  COMPONENT: {
    ORIGIN: "// WXQ-BUILD-COMP # NOT DELETE",
  },
};
