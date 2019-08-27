import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import BaseComp from "../BaseComp";

interface I<%= upCaseClassName%>Comp {
  //
}

@Component({
  components: {},
})
export default class <%= upCaseClassName%>Comp extends mixins(BaseComp) implements I<%= upCaseClassName%>Comp {

  title: string = "<%= lineClassName%>";
  
  mounted() {
    //
  }
}
