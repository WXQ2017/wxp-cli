module.exports = CONSTANT = {
  PAGE: {
    ORIGIN: "// WXQ-BUILD-PAGE # NOT DELETE",
    CONTENT:
      '// <%= lineClassName%> PAGE BEGIN\nexport function <%= upCaseClassName%>PagePreloading(): Promise<any> {\n  return import("./<%= lineClassName%>/<%= lineClassName%>.vue").catch(error => {\n    return dealWithError(error, "<%= upCaseClassName%>");\n  });\n}\n// <%= lineClassName%> PAGE END',
    REGX:
      "// <%= lineClassName%> PAGE BEGIN\n[\\s\\S]*// <%= lineClassName%> PAGE END",
    ROUTER_ORIGIN: "// WXQ-BUILD-ROUTER-PAGE # NOT DELETE",
    ROUTER_CONTENT:
      '  {\n    component: PageLoading.<%= upCaseClassName%>PagePreloading,\n    name: "<%= upCaseClassName%>",\n    path: "/<%= lowLineClassName%>",\n  },',
    ROUTER_REGX: "",
  },
  COMPONENT: {
    ORIGIN: "// WXQ-BUILD-COMP-REQUIRE # NOT DELETE",
    NAME_ORIGIN: "// WXQ-BUILD-COMP-NAME # NOT DELETE",
    // CONTENT:
    //   'Vue.component("<%= className%>", require("./<%= lineClassName%>/<%= lineClassName%>.vue").default);',
    CONTENT:
      'import <%= upCaseClassName%> from "./<%= lineClassName%>/<%= lineClassName%>.vue";',
    NAME_CONTENT: "  <%= upCaseClassName%>,",
    // REGX:
    //   'Vue\\.component\\("<%= className%>", require\\("\\./<%= lineClassName%>/<%= lineClassName%>\\.vue"\\)\\.default\\);',
    REGX:
      'import <%= upCaseClassName%> from "\\./<%= lineClassName%>/<%= lineClassName%>\\.vue";',
  },
};
